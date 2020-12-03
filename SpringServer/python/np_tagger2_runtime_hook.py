#-----------------------------------------------------------------------------
# np_tagger2: Runtim Hook
#-----------------------------------------------------------------------------
import sys
import os
import spacy

spacy.util.set_data_path(os.path.join(sys._MEIPASS, "spacy", "data"))
