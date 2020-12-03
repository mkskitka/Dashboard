import spacy
import argparse
from itertools import chain

import en_core_web_sm

nlp = en_core_web_sm.load()
#nlp = spacy.load("en_core_web_sm")


def main(input_str):    
    doc = nlp(input_str)
    tagged_sent = tag_NPs_expansively(doc)
    print(tagged_sent)
    return tagged_sent


def tag_NPs_narrowly(doc):
	#deprecated/not in use
	#but leave here for reference
    doc_text = doc.text
    tagged_sent = ""
    np_chunks = [chunk for chunk in doc.noun_chunks]
    last_span_end_index = 0
    for chunk in np_chunks:
        start = chunk.start_char
        end = chunk.end_char
        tagged_np = doc_text[last_span_end_index:start] + " <NP>" + doc_text[start:end] + "</NP> "
        tagged_sent = tagged_sent + tagged_np
        last_span_end_index = end
    return tagged_sent


def tag_NPs_expansively(doc):
    doc_text = doc.text
    tagged_sent = ""
    last_span_end_index = 0
    spans = list()
    for chunk in doc.noun_chunks:
        # print("chunk", chunk)
        start = chunk.start_char
        end = chunk.end_char
        left_edge = chunk.root.left_edge.i
        children = [c for c in chunk.root.children]
        # print("chunk root:", chunk.root, ", children:", children)
        right_edge = chunk.root.right_edge.i + 1
        for child in children:
            if child.dep_ == "prep" and "pobj" in [c.dep_ for c in child.children] and child.text != "of":
                # need to get NP that is dep 'pobj' and token after 'and' (will it always be a 'conj'? looks like yes)
                right_edge = chunk.end
            elif child.dep_ == "cc" and "conj" in [c.dep_ for c in children]:
                right_edge = chunk.end
        curr_span = [i for i in range(left_edge, right_edge + 1)]
        if not curr_span in spans and not curr_span[0] in chain(*spans) and not curr_span[-1] in chain(*spans):
            tagged_np = doc.text[last_span_end_index:start] + "<NP>" + (doc[left_edge:right_edge].text) + "</NP>"
            tagged_sent = tagged_sent + tagged_np
            last_span_end_index = end
            spans.append(curr_span)
        else:
            last_span_end_index = end
            continue
    return tagged_sent


def get_dep(doc):
    """for insight into dep relationships in a text"""
    for token in doc:
        print(token.text, token.pos_, token.dep_, token.head.text, token.head.pos_,
              [child for child in token.children])


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Parses and tags NP Chunks using SpaCy\'s dependency parser.')
    parser.add_argument('i',
                        type=str,
                        help='Input string sentence to be tagged')
    args = parser.parse_args()
    main(args.i)
