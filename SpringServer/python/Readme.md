# Setting up Python Environment
Need to have python on the machine executing this service
1. Install python 3.7 from the Software Center
2. Install Anaconda for Windows (Installer: https://www.anaconda.com/distribution/#download-section)
3. Open Anaconda Powershell or in Windows Command Prompt
4. Create environment:
    ```
    conda create --name processenv
    ```
    Note: Environment location will be: C:\Users\\_user name_\Anaconda3\envs\processenv
5. Activate environment:
    ```
    >> conda activate processenv
    ```
6. Install spacy:
    ```
     >> conda install -c conda-forge spacy
     >> python -m spacy download en_core_web_sm
    ```
	 Note: Library will be installed in: C:\Users\\_user name_\Anaconda3\envs\processenv\lib\site-packages\spacy
7. Validate: 
    ```
    >> python -m spacy validate
    ```
8. Run tag script on a sample sentence: 
    ```
    >> python np_tagger2.py "We expect a negative association between situation awareness and unsafe actions."
    ```
9. To deactivate environment: 
    ```
    >> conda deactivate
    ```
# To create executable using Anaconda
1. Open Anaconda Powershell
2. Install pyinstaller:  
    ```
    >> conda install -c conda-forge pyinstaller
    ```
3. Check version: 
    ```
    >> pyinstaller --version
    ```
4. Go to the directory of python script: 
    ```
    >> cd C:\Users\mhiett\Desktop\SFGEndpoint
    ```
5. Create a spec file: 
    ```
    >> ..\..\Anaconda3\Scripts\pyi-makespec.exe --onefile np_tagger2.py
    ```
6. Modify the spec file to add hidden imports (**already done**)
7. Add a "np_tagger2_runtime_hook.py" file to the directory where the script is located. (**already done**)
8. Create executable: 
    ```
    >> pyinstaller np_tagger2.spec
    ```
9. Upon successful completion, executable file is in the "dist" folder.
10. Test the executable: 
    ```
    >> cd dist
    >> np_tagger2.exe "We expect a negative association between situation awareness and unsafe actions."
    ```