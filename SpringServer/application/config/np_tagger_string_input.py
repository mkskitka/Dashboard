import spacy
import argparse
from itertools import chain


nlp = spacy.load("en_core_web_sm")


def main(input_str):    
    doc = nlp(input_str)
    # exp_sent = tag_NPs_expansively(doc)
    # print(exp_sent)
    tagged_sent = remove_matrix(doc)
    # get_dep(doc)
    print(tagged_sent)
    return tagged_sent


def tag_NPs_narrowly(doc):
    """deprecated/not in use, here for reference"""
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
    """deprecated/not in use, here for reference"""
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
        # print("chunk root:", chunk.root, ", children:", children, ", dep:", chunk.root.dep_, ", head:", chunk.root.head)
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
              [child for child in token.children], [child.dep_ for child in token.children])


def remove_matrix(doc):
    tagged_sent = ""
    last_span_end_index = 0
    spans = list()
    noun_chunks = [chunk for chunk in doc.noun_chunks]
    # print("spaCy noun chunks: ", noun_chunks)
    # tokens = [t for t in doc]
    # for token in tokens:
    #     if token.pos_ == "PROPN":
    #         span = doc[token.i:token.i+1]
    #         if span not in noun_chunks:
    #             print(span)
                # noun_chunks.append(span)
    # print("spaCy tokens: ", tokens)
    for chunk in noun_chunks:
        # print("chunk", chunk)
        last_chunk = False
        if chunk == noun_chunks[-1]:
            last_chunk = True
        if chunk.root.head.dep_ == "ROOT" and 'ccomp' in [c.dep_ for c in chunk.root.head.children]:
            continue
        elif chunk.root.dep_ == "pobj" and chunk.root.head.head.dep_ == "ROOT" and 'ccomp' in [c.dep_ for c in chunk.root.head.head.children]:
            continue
        else:
            start = chunk.start_char
            end = chunk.end_char
            left_edge = chunk.root.left_edge.i
            if chunk.root.dep_ == "dobj" and chunk.root.head.dep_ == "csubj":
                start = chunk.root.head.left_edge.i
                left_edge = chunk.root.head.left_edge.i
            children = [c for c in chunk.root.children]
            # print("chunk root:", chunk.root, ", children:", children, ", dep:", chunk.root.dep_, ", head:", chunk.root.head)
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
            if last_chunk:
                tagged_sent = tagged_sent + doc.text[last_span_end_index:]
    return tagged_sent

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Parses and tags NP Chunks using SpaCy\'s dependency parser.')
    parser.add_argument('i',
                        type=str,
                        help='Input string sentence to be tagged')
    args = parser.parse_args()
    main(args.i)
