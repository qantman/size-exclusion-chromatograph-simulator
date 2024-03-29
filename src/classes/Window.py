from tkinter import *
import sys
class Window():
    def __init__(self, root):
        self._root = root
        self._root.minsize(720, 600)
        self._root.columnconfigure(0, weight=0)
        self._root.rowconfigure(5, weight=1)
        self._chek_frame = Frame(self._root)
        self._chek_frame.place(x=40, y=40)
    def _get_screenwidth(self):
        return self._root.winfo_screenwidth() 
    def _get_screenheight(self):
        return self._root.winfo_screenheight()
    def createWindow(self):
        self._root.geometry(f"{self._get_screenwidth()}x{self._get_screenheight()}")
        self._root.protocol('WM_DELETE_WINDOW', self.close)
        self._root.mainloop()
    def close(self):
        self._root.quit()
        self._root.destroy()
        sys.exit()
        
