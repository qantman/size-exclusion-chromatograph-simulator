from src.classes.Basis import Basis
import tkinter
from tkinter import ttk
class Comboboxes(Basis):
    def __init__(self, root):
        self.root = root
        self.values = [] 
    def set_value(self, number_value, value):
        self.values[number_value] = value
    def get_value(self, number_value):
        return self.values[number_value]
    def create_value(self, values:list, coordinates:list, sticky:str) -> tkinter.ttk.Combobox:
        combobox = ttk.Combobox(values = values, font=("Times new roman", 14)) #Обращение к нужной библиотеке
        self.values.append(combobox) #Вызов метода класса внутри класса
        combobox.grid(row=coordinates[0], column=coordinates[1], sticky=sticky) #Метод для расположения элемента по сетке
        return combobox