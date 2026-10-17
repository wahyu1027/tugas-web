import numpy as np
import skfuzzy as fuzz
from skfuzzy import control as ctrl

class BeasiswaFuzzyEngine:
    def __init__(self):
        # 1. Semesta Pembicaraan (Input & Output)
        self.ipk = ctrl.Antecedent(np.arange(0, 4.01, 0.01), 'ipk')
        self.penghasilan = ctrl.Antecedent(np.arange(0, 15.1, 0.1), 'penghasilan')
        self.kelayakan = ctrl.Consequent(np.arange(0, 101, 1), 'kelayakan')

        # 2. Inisialisasi Keanggotaan & Aturan
        self._build_membership_functions()
        self._build_rules()

        # 3. Buat Sistem Kontrol
        self.system = ctrl.ControlSystem(self.rules)

    def _build_membership_functions(self):
        # IPK
        self.ipk['rendah'] = fuzz.trimf(self.ipk.universe, [0, 0, 2.75])
        self.ipk['sedang'] = fuzz.trimf(self.ipk.universe, [2.5, 3.0, 3.5])
        self.ipk['tinggi'] = fuzz.trimf(self.ipk.universe, [3.25, 4.0, 4.0])

       
     # Sesuaikan range dalam Rupiah

        self.penghasilan = ctrl.Antecedent(np.arange(0, 10_000_001, 100_000), 'penghasilan')
        
        self.penghasilan['sangat_rendah'] = fuzz.trimf(self.penghasilan.universe, [0, 0, 2_000_000])
        self.penghasilan['rendah'] = fuzz.trimf(self.penghasilan.universe, [1_000_000, 2_500_000, 4_000_000])
        self.penghasilan['sedang'] = fuzz.trimf(self.penghasilan.universe, [3_000_000, 5_000_000, 7_000_000])
        self.penghasilan['tinggi'] = fuzz.trimf(self.penghasilan.universe, [6_000_000, 10_000_000, 10_000_000])

        # Skor Kelayakan (0 - 100%)
        self.kelayakan['rendah'] = fuzz.trimf(self.kelayakan.universe, [0, 0, 50])
        self.kelayakan['sedang'] = fuzz.trimf(self.kelayakan.universe, [30, 50, 75])
        self.kelayakan['tinggi'] = fuzz.trimf(self.kelayakan.universe, [60, 100, 100])

    def _build_rules(self):
        rule1 = ctrl.Rule(self.ipk['tinggi'] & self.penghasilan['rendah'], self.kelayakan['tinggi'])
        rule2 = ctrl.Rule(self.ipk['sedang'] & self.penghasilan['rendah'], self.kelayakan['sedang'])
        rule3 = ctrl.Rule(self.ipk['tinggi'] & self.penghasilan['sedang'], self.kelayakan['sedang'])
        rule4 = ctrl.Rule(self.ipk['rendah'] | self.penghasilan['tinggi'], self.kelayakan['rendah'])
        
        self.rules = [rule1, rule2, rule3, rule4]

    def hitung_kelayakan(self, val_ipk: float, val_penghasilan: float) -> float:
        simulasi = ctrl.ControlSystemSimulation(self.system)
        simulasi.input['ipk'] = val_ipk
        simulasi.input['penghasilan'] = val_penghasilan
        simulasi.compute()
        return float(simulasi.output['kelayakan'])