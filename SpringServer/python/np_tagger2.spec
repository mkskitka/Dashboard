# -*- mode: python ; coding: utf-8 -*-
import sys
import PyInstaller

sys.setrecursionlimit(5000)

block_cipher = None
datas = []

# spaCy
datas.extend(PyInstaller.utils.hooks.collect_data_files('spacy.lang', include_py_files = True))
datas.extend(PyInstaller.utils.hooks.collect_data_files('en_core_web_sm'))
datas.extend(PyInstaller.utils.hooks.collect_data_files('thinc'))

a = Analysis(['np_tagger2.py'],
             pathex=['C:\\Users\\mhiett\\Desktop\\SFGEndpoint'],
             binaries=[],
             datas=datas,
             hiddenimports=[
				'pkg_resources.py2_warn',
				'srsly.msgpack.util',
				
				'cymem',
				'cymem.cymem',
				
				'preshed.maps',
				
				'blis',
				'blis.py',
				
				'thinc.extra.search',
				'thinc.linalg',
				'thinc.neural._aligned_alloc',
				'thinc.neural._custom_kernels',
				
				'murmurhash',
				'murmurhash.mrmr',
				
				'cytoolz.utils',
				'cytoolz._signatures',
				
				'spacy.kb',
				'spacy.lexeme',
				'spacy.matcher._schemas',
				'spacy.morphology',
				'spacy.parts_of_speech',
				'spacy.syntax._beam_utils',
				'spacy.syntax._parser_model',
				'spacy.syntax.arc_eager',
				'spacy.syntax.ner',
				'spacy.syntax.nn_parser',
				'spacy.syntax.stateclass',
				'spacy.syntax.transition_system',
				'spacy.tokens._retokenize',
				'spacy.tokens.morphanalysis',
				'spacy.tokens.underscore'],
             hookspath=[],
             runtime_hooks=['np_tagger2_runtime_hook.py'],
             excludes=[],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher,
             noarchive=False)
pyz = PYZ(a.pure, a.zipped_data,
             cipher=block_cipher)
exe = EXE(pyz,
          a.scripts,
          a.binaries,
          a.zipfiles,
          a.datas,
          [],
          name='np_tagger2',
          debug=False,
          bootloader_ignore_signals=False,
          strip=False,
          upx=True,
          upx_exclude=[],
          runtime_tmpdir=None,
          console=True )
