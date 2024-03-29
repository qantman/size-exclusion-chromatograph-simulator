from src.classes.Window import Window
from src.classes.Coordinates import Coordinates
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import (
    FigureCanvasTkAgg, NavigationToolbar2Tk)
from matplotlib.figure import Figure
from tkinter.messagebox import showinfo, askyesnocancel
import time
import random
class Plot(Window):
    def _check_screenheight_for_plot(self):
        screenheight = self._get_screenheight()
        plot_Y = 10
        if 1080 > screenheight >= 920:
            plot_Y = 10
        elif 920 > screenheight >= 768:
            plot_Y = 7
        elif 768 > screenheight >= 600:
            plot_Y = 5
        elif 600 > screenheight:
            plot_Y = 4
        return plot_Y
    def _check_screenwidth_for_plot(self):
        screenwidth = self._get_screenwidth()
        plot_X = 10
        if 1920 > screenwidth >= 1600:
            plot_X = 8
        elif 1600 > screenwidth >= 1366: 
            plot_X = 7
        elif 1366 > screenwidth >= 800:
            plot_X = 5
        elif 800 > screenwidth:
            plot_X = 4
        return plot_X
    def __init__(self, root):
        super().__init__(root)
        self._points = []
        self._plot_X = self._check_screenheight_for_plot()
        self._plot_Y = self._check_screenwidth_for_plot()
        self._fig = Figure(figsize=(self._plot_X, self._plot_Y), dpi=100)#Размер графика
        self._canvas = FigureCanvasTkAgg(self._fig, master=self._root)
        self._canvas.draw()
        self._canvas.get_tk_widget().grid(row=0, column=0, columnspan=40, rowspan=40)#Положение графика
        self._toolbar = NavigationToolbar2Tk(self._canvas, self._root, pack_toolbar=False).grid(row=0, column=40, rowspan=1, sticky="nw")
        self._ax = self._fig.add_subplot(111)
        self._ax.grid(color='#000000', linewidth=0.75)
        self._FileNames = [
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
    def set_path(self, path):
        self.listCoordinates = {
            "5000_ПС_stnd": Coordinates(path[0]), 
            "10000_ПС_stnd": Coordinates(path[1]), 
            "50000_ПС_stnd": Coordinates(path[2]), 
            "100000_ПС_stnd": Coordinates(path[3]), 
            "400000_ПС_stnd": Coordinates(path[4]), 
            "1000000_ПС_stnd": Coordinates(path[5]),
            "investigation-1": Coordinates(path[6]),
            "investigation-2": Coordinates(path[7]),
            "investigation-3": Coordinates(path[8]),
            "investigation-4": Coordinates(path[9]),
        }
    def set_combobox(self, combobox):
        self.combobox = combobox
    def create_plot(self, filename:str) -> object:
        plt.figure(figsize=(20, 10))
        xy = self.listCoordinates[filename].get_coordinates()
        self._ax.clear()
        self._resultClic =  askyesnocancel(title="Подтвержение загрузки вещества", message="Подтвердить загрузку?")
        if self._resultClic==None:
            showinfo("Результат", "Загрузки приостановлена")
        elif self._resultClic:
            time.sleep(random.uniform(1, 3))
            self._ax.set_title(self.combobox.get(), fontsize=18)
            self._ax.set_xlabel("Value", fontsize=16)
            self._ax.set_ylabel("M", fontsize=16)
            self._ax.grid(color='#000000', linewidth=0.75)
            self._ax.plot(xy["x"], xy["y"], "-", color = (0, 0, 0))
            self._canvas.draw()
            showinfo("Результат", "Загрузка вещества прошла успешно")
        else: 
            showinfo("Результат", "Загрузка реагента отменена")
    def selected(self, event):
        self.create_plot(self.combobox.get())