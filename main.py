from src.configs.Config import Configure
from src.classes.Window import Window
import tkinter as tk
import os
import platform
FileNames = [
    "5000.json", 
    "10000.json", 
    "50000.json", 
    "100000.json", 
    "400000.json", 
    "1000000.json",
    "investigation-1.json",
    "investigation-2.json",
    "investigation-3.json",
    "investigation-4.json",
    ]
path = os.path.dirname(__file__)
path_to_files = []
for i in FileNames:
    if platform.system() == "Windows":
        path_to_files.append(f"{path}\\src\\Data\\{i}")
    elif platform.system() == "Linux":
        path_to_files.append(f"{path}/src/Data/{i}")
root = tk.Tk()
win = Window(root)
root.protocol("WM_DELETE_WINDOW", win.close)
conf = Configure(root)
conf.set_path(path_to_files)
conf.set_configure()
win.createWindow()

