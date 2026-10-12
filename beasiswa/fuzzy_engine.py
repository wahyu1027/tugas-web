import numpy as np
import skfuzzy as fuzz
from skfuzzy import control as ctrl


class BeasiswaFuzzyEngine:
    """
    Fuzzy Mamdani Engine untuk penilaian kelayakan beasiswa.
    Dilengkapi fitur EXPLAINABILITY:
    - Fuzzifikasi (derajat keanggotaan)
    - Rules yang ter-trigger
    - Detail defuzzifikasi
    - Kesimpulan naratif otomatis
    """

    def __init__(self):
        self._build_variables()
        self._build_rules()
        self.system = ctrl.ControlSystem(self.rules)
        self.sim = ctrl.ControlSystemSimulation(self.system)

    # ============================================================
    # DEFINISI VARIABEL & FUNGSI KEANGGOTAAN
    # ============================================================
    def _build_variables(self):
        # --- Antecedents (Input) ---
        self.ipk = ctrl.Antecedent(np.arange(0, 4.01, 0.01), 'ipk')
        self.penghasilan = ctrl.Antecedent(
            np.arange(0, 10_000_001, 100_000), 'penghasilan'
        )

        # --- Consequent (Output) ---
        self.kelayakan = ctrl.Consequent(np.arange(0, 101, 1), 'kelayakan')

        # --- Membership Functions: IPK ---
        self.ipk['rendah'] = fuzz.trimf(self.ipk.universe, [0, 0, 2.5])
        self.ipk['sedang'] = fuzz.trimf(self.ipk.universe, [2.0, 2.75, 3.25])
        self.ipk['tinggi'] = fuzz.trimf(self.ipk.universe, [3.0, 3.5, 3.8])
        self.ipk['sangat_tinggi'] = fuzz.trimf(self.ipk.universe, [3.6, 4.0, 4.0])

        # --- Membership Functions: Penghasilan (Rupiah) ---
        self.penghasilan['sangat_rendah'] = fuzz.trimf(
            self.penghasilan.universe, [0, 0, 2_000_000]
        )
        self.penghasilan['rendah'] = fuzz.trimf(
            self.penghasilan.universe, [1_000_000, 2_500_000, 4_000_000]
        )
        self.penghasilan['sedang'] = fuzz.trimf(
            self.penghasilan.universe, [3_000_000, 5_000_000, 7_000_000]
        )
        self.penghasilan['tinggi'] = fuzz.trimf(
            self.penghasilan.universe, [6_000_000, 10_000_000, 10_000_000]
        )

        # --- Membership Functions: Output ---
        self.kelayakan['tidak_layak'] = fuzz.trimf(
            self.kelayakan.universe, [0, 0, 40]
        )
        self.kelayakan['dipertimbangkan'] = fuzz.trimf(
            self.kelayakan.universe, [30, 50, 70]
        )
        self.kelayakan['layak'] = fuzz.trimf(
            self.kelayakan.universe, [60, 75, 90]
        )
        self.kelayakan['sangat_layak'] = fuzz.trimf(
            self.kelayakan.universe, [85, 100, 100]
        )

    # ============================================================
    # RULE BASE
    # ============================================================
    def _build_rules(self):
        self.rules = [
            # --- Sangat Layak ---
            ctrl.Rule(
                self.ipk['sangat_tinggi'] & self.penghasilan['sangat_rendah'],
                self.kelayakan['sangat_layak'],
                label='R01',
            ),
            ctrl.Rule(
                self.ipk['sangat_tinggi'] & self.penghasilan['rendah'],
                self.kelayakan['sangat_layak'],
                label='R02',
            ),
            ctrl.Rule(
                self.ipk['tinggi'] & self.penghasilan['sangat_rendah'],
                self.kelayakan['sangat_layak'],
                label='R03',
            ),

            # --- Layak ---
            ctrl.Rule(
                self.ipk['tinggi'] & self.penghasilan['rendah'],
                self.kelayakan['layak'],
                label='R04',
            ),
            ctrl.Rule(
                self.ipk['tinggi'] & self.penghasilan['sedang'],
                self.kelayakan['layak'],
                label='R05',
            ),
            ctrl.Rule(
                self.ipk['sedang'] & self.penghasilan['sangat_rendah'],
                self.kelayakan['layak'],
                label='R06',
            ),
            ctrl.Rule(
                self.ipk['sedang'] & self.penghasilan['rendah'],
                self.kelayakan['layak'],
                label='R07',
            ),

            # --- Dipertimbangkan ---
            ctrl.Rule(
                self.ipk['sedang'] & self.penghasilan['sedang'],
                self.kelayakan['dipertimbangkan'],
                label='R08',
            ),
            ctrl.Rule(
                self.ipk['tinggi'] & self.penghasilan['tinggi'],
                self.kelayakan['dipertimbangkan'],
                label='R09',
            ),
            ctrl.Rule(
                self.ipk['rendah'] & self.penghasilan['sangat_rendah'],
                self.kelayakan['dipertimbangkan'],
                label='R10',
            ),

            # --- Tidak Layak ---
            ctrl.Rule(
                self.ipk['rendah'] & self.penghasilan['sedang'],
                self.kelayakan['tidak_layak'],
                label='R11',
            ),
            ctrl.Rule(
                self.ipk['rendah'] & self.penghasilan['tinggi'],
                self.kelayakan['tidak_layak'],
                label='R12',
            ),
            ctrl.Rule(
                self.ipk['sedang'] & self.penghasilan['tinggi'],
                self.kelayakan['tidak_layak'],
                label='R13',
            ),
        ]

    # ============================================================
    # HELPER: Hitung Derajat Keanggotaan (Fuzzifikasi)
    # ============================================================
    def _fuzzify(self, variabel, nilai, mf_names):
        """Hitung derajat keanggotaan setiap MF dari satu nilai input."""
        hasil = {}
        for mf in mf_names:
            derajat = fuzz.interp_membership(
                variabel.universe, variabel[mf].mf, nilai
            )
            hasil[mf] = round(float(derajat), 4)
        return hasil

    # ============================================================
    # HELPER: Hitung Rules Aktif (Firing Strength) — MANUAL
    # ============================================================
    def _get_active_rules(self, val_ipk, val_penghasilan, threshold=0.01):
        """
        Hitung firing strength setiap rule secara manual.
        α = min(μ_ipk, μ_penghasilan)  [karena operator AND]

        Return: list of dict {kode, kondisi, konsekuen, alpha}
        """
        # Derajat keanggotaan IPK
        ipk_m = {
            'rendah': float(fuzz.interp_membership(
                self.ipk.universe, self.ipk['rendah'].mf, val_ipk)),
            'sedang': float(fuzz.interp_membership(
                self.ipk.universe, self.ipk['sedang'].mf, val_ipk)),
            'tinggi': float(fuzz.interp_membership(
                self.ipk.universe, self.ipk['tinggi'].mf, val_ipk)),
            'sangat_tinggi': float(fuzz.interp_membership(
                self.ipk.universe, self.ipk['sangat_tinggi'].mf, val_ipk)),
        }

        # Derajat keanggotaan Penghasilan
        gaji_m = {
            'sangat_rendah': float(fuzz.interp_membership(
                self.penghasilan.universe, self.penghasilan['sangat_rendah'].mf, val_penghasilan)),
            'rendah': float(fuzz.interp_membership(
                self.penghasilan.universe, self.penghasilan['rendah'].mf, val_penghasilan)),
            'sedang': float(fuzz.interp_membership(
                self.penghasilan.universe, self.penghasilan['sedang'].mf, val_penghasilan)),
            'tinggi': float(fuzz.interp_membership(
                self.penghasilan.universe, self.penghasilan['tinggi'].mf, val_penghasilan)),
        }

        # Definisi rule (sesuai rule base di _build_rules)
        rule_defs = [
            # (kode, ipk_mf, gaji_mf, konsekuen)
            ('R01', 'sangat_tinggi', 'sangat_rendah', 'sangat_layak'),
            ('R02', 'sangat_tinggi', 'rendah', 'sangat_layak'),
            ('R03', 'tinggi', 'sangat_rendah', 'sangat_layak'),
            ('R04', 'tinggi', 'rendah', 'layak'),
            ('R05', 'tinggi', 'sedang', 'layak'),
            ('R06', 'sedang', 'sangat_rendah', 'layak'),
            ('R07', 'sedang', 'rendah', 'layak'),
            ('R08', 'sedang', 'sedang', 'dipertimbangkan'),
            ('R09', 'tinggi', 'tinggi', 'dipertimbangkan'),
            ('R10', 'rendah', 'sangat_rendah', 'dipertimbangkan'),
            ('R11', 'rendah', 'sedang', 'tidak_layak'),
            ('R12', 'rendah', 'tinggi', 'tidak_layak'),
            ('R13', 'sedang', 'tinggi', 'tidak_layak'),
        ]

        active = []
        for kode, ipk_mf, gaji_mf, konsekuen in rule_defs:
            alpha = min(ipk_m[ipk_mf], gaji_m[gaji_mf])  # AND = minimum

            if alpha > threshold:
                active.append({
                    'kode': kode,
                    'kondisi': (
                        f"IPK={ipk_mf.replace('_', ' ').title()} "
                        f"AND Penghasilan={gaji_mf.replace('_', ' ').title()}"
                    ),
                    'konsekuen': konsekuen.replace('_', ' ').title(),
                    'alpha': round(alpha, 4),
                })

        # Sort by alpha descending
        active.sort(key=lambda x: x['alpha'], reverse=True)
        return active

    # ============================================================
    # METHOD UTAMA: HITUNG KELAYAKAN + EXPLAINABILITY
    # ============================================================
    def hitung_kelayakan(self, val_ipk, val_penghasilan):
        """
        Hitung skor kelayakan + return detail penjelasan.

        Args:
            val_ipk: float (0-4)
            val_penghasilan: int/float (rupiah)

        Returns:
            dict: {
                'skor', 'kategori', 'fuzzifikasi', 
                'rules_aktif', 'kesimpulan'
            }
        """
        # Set input & compute
        self.sim.input['ipk'] = val_ipk
        self.sim.input['penghasilan'] = val_penghasilan
        self.sim.compute()

        skor = float(self.sim.output['kelayakan'])

        # --- Fuzzifikasi ---
        fuzzifikasi = {
            'ipk': {
                'nilai': val_ipk,
                'derajat': self._fuzzify(
                    self.ipk,
                    val_ipk,
                    ['rendah', 'sedang', 'tinggi', 'sangat_tinggi'],
                ),
            },
            'penghasilan': {
                'nilai': val_penghasilan,
                'derajat': self._fuzzify(
                    self.penghasilan,
                    val_penghasilan,
                    ['sangat_rendah', 'rendah', 'sedang', 'tinggi'],
                ),
            },
        }

        # --- Rules Aktif ---
        rules_aktif = self._get_active_rules(
            val_ipk, val_penghasilan, threshold=0.01
        )

        # --- Kategori ---
        if skor >= 85:
            kategori = 'Sangat Layak'
        elif skor >= 70:
            kategori = 'Layak'
        elif skor >= 45:
            kategori = 'Dipertimbangkan'
        else:
            kategori = 'Tidak Layak'

        # --- Kesimpulan otomatis ---
        kesimpulan = self._generate_kesimpulan(
            val_ipk, val_penghasilan, fuzzifikasi, skor, kategori
        )

        return {
            'skor': round(skor, 2),
            'kategori': kategori,
            'fuzzifikasi': fuzzifikasi,
            'rules_aktif': rules_aktif,
            'kesimpulan': kesimpulan,
        }

    # ============================================================
    # HELPER: Generate Kesimpulan Naratif Otomatis
    # ============================================================
    def _generate_kesimpulan(self, ipk, penghasilan, fuzzifikasi, skor, kategori):
        """Buat kesimpulan naratif dari hasil fuzzy."""

        # Cari MF dominan IPK
        ipk_derajat = fuzzifikasi['ipk']['derajat']
        ipk_dominan = max(ipk_derajat, key=ipk_derajat.get)
        ipk_derajat_max = ipk_derajat[ipk_dominan]

        # Cari MF dominan Penghasilan
        gaji_derajat = fuzzifikasi['penghasilan']['derajat']
        gaji_dominan = max(gaji_derajat, key=gaji_derajat.get)

        # Format label
        ipk_label = ipk_dominan.replace('_', ' ').title()
        gaji_label = gaji_dominan.replace('_', ' ').title()

        # Format Rupiah
        gaji_formatted = f"Rp {int(penghasilan):,}".replace(",", ".")

        return (
            f"Mahasiswa dengan IPK {ipk} ({ipk_label}, derajat keanggotaan "
            f"{ipk_derajat_max:.2f}) dan penghasilan orang tua {gaji_formatted} "
            f"({gaji_label}) mendapatkan skor kelayakan {skor:.1f}% dengan "
            f"status {kategori}."
        )