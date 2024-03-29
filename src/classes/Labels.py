from src.classes.Basis import Basis 
from tkinter import *
class Labels(Basis):
    def __init__(self, root):
        self.root = root 
        self.values = []
    def set_value(self, number_value, value):
        self.values[number_value] = value
    def get_value(self, number_value):
        return self.values[number_value]
    def create_value(self, value, coordinates, span:list ,sticky:str) -> Label:
        label = Label(self.root, text=value, font=("Times new roman", 18)).grid(
            row=coordinates[0], 
            column=coordinates[1], 
            sticky=sticky, 
            columnspan=span[0], 
            rowspan=span[1],
        )
        self.values.append(Label)
        return label