
path = r"c:\Users\Administrator\Documents\Cyprusforchrist\backend\media\sermons\pdfs\laodicee_Lht0mTf.pdf"
try:
    with open(path, 'rb') as f:
        header = f.read(20)
        print(f"Header: {header}")
except Exception as e:
    print(f"Error: {e}")
