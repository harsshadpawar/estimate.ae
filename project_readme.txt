=====Git=======

steps - 

1. conda create -n estconda python=3.8
2. conda activate estconda
3. conda install -c conda-forge pythonocc-core
4. pip install manufacturingtoolkit -i https://download.cadexsoft.com/mtk/python
5. pip install -r requirements.txt


Run = 
PYTHONDONTWRITEBYTECODE=1 uvicorn app.main:app --reload





