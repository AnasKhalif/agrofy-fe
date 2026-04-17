import { useState } from "react";
import { Icon } from "@iconify/react";
import { useGetFoods, useCreateFood, useDeleteFood, useUpdateFood } from "@/app/api/food/useFoodApi";
import type { CreateFoodRequest, FoodItem } from "@/app/api/food/foodApi";
import { usePermission, useToast } from "@/shared/hooks";
import { PERMISSIONS } from "@/app/constants/permission";
import { Button } from "@/shared/components/agrofy-ui/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/agrofy-ui/ui/dialog";
import { Input } from "@/shared/components/agrofy-ui/ui/input";
import { Label } from "@/shared/components/agrofy-ui/ui/label";
import { Textarea } from "@/shared/components/agrofy-ui/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/agrofy-ui/ui/alert-dialog";

const CATEGORY_COLORS: Record<string, string> = {
  umum:     'bg-blue-100 text-blue-700',
  stunting: 'bg-orange-100 text-orange-700',
  tinggi:   'bg-green-100 text-green-700',
};

const CATEGORY_LABELS: Record<string, string> = {
  umum:     'Umum',
  stunting: 'Stunting',
  tinggi:   'Tinggi Badan',
};

const CATEGORY_ICONS: Record<string, string> = {
  umum:     'solar:plate-outline',
  stunting: 'solar:heart-pulse-outline',
  tinggi:   'solar:graph-up-outline',
};

// Stimulasi tumbuh kembang per kelompok usia — SDIDTK Kemenkes 2022
const STIMULASI_DATA = [
  {
    ageLabel: '0–2 Bulan',
    icon: 'solar:baby-outline',
    motorikKasar: 'Letakkan bayi tengkurap sesaat setelah minum, angkat kepala bayi saat digendong posisi tegak.',
    motorikHalus: 'Letakkan jari atau benda di telapak tangan bayi agar ia menggenggam.',
    bicara: 'Ajak bicara, tersenyum, dan buat kontak mata sesering mungkin. Perdengarkan suara lembut dan musik.',
    sosial: 'Gendong, peluk, dan usap bayi dengan penuh kasih sayang agar merasa aman dan nyaman.',
  },
  {
    ageLabel: '3–5 Bulan',
    icon: 'solar:baby-outline',
    motorikKasar: 'Latih bayi tengkurap lebih lama, bantu bayi berguling, topang badan saat didudukkan.',
    motorikHalus: 'Gantungkan mainan berwarna cerah agar bayi meraih dan memegang.',
    bicara: 'Tirukan suara yang dibuat bayi, ajak berbicara saat menyusui dan merawat.',
    sosial: 'Perkenalkan wajah anggota keluarga, buat bayi tertawa dengan ekspresi wajah dan suara lucu.',
  },
  {
    ageLabel: '6–8 Bulan',
    icon: 'solar:baby-outline',
    motorikKasar: 'Latih bayi duduk mandiri dengan ditopang, bantu bayi merangkak dengan meletakkan mainan di depannya.',
    motorikHalus: 'Berikan mainan yang bisa dipindahkan dari satu tangan ke tangan lain, benda kecil aman untuk digenggam.',
    bicara: 'Panggil nama bayi, ajari kata-kata sederhana (mama, papa), bacakan buku bergambar.',
    sosial: 'Ajak bermain cilukba, perkenalkan bayi pada orang lain secara bertahap untuk mengurangi cemas perpisahan.',
  },
  {
    ageLabel: '9–11 Bulan',
    icon: 'solar:baby-outline',
    motorikKasar: 'Latih bayi berdiri berpegangan, beri ruang aman untuk merangkak dan merambat.',
    motorikHalus: 'Ajari bayi memungut benda kecil dengan dua jari (pincer grasp), bermain menumpuk balok.',
    bicara: 'Ajari kata "tidak", namakan benda sehari-hari, dan minta bayi menunjuk gambar di buku.',
    sosial: 'Ajari bayi melambaikan tangan dan bertepuk tangan, bermain permainan sederhana bersama.',
  },
  {
    ageLabel: '12–17 Bulan',
    icon: 'solar:running-round-outline',
    motorikKasar: 'Beri dukungan saat anak belajar berjalan, ajak bermain bola guling, latih naik turun tangga dengan pegangan.',
    motorikHalus: 'Ajari memegang krayon/pensil, bermain tumpuk balok 2–3 buah, masukkan benda ke dalam wadah.',
    bicara: 'Perkaya kosakata dengan menamai benda di sekitar, bacakan buku cerita bergambar setiap hari.',
    sosial: 'Ajari anak makan sendiri dengan sendok, meniru kegiatan rumah tangga sederhana (menyapu, menaruh baju).',
  },
  {
    ageLabel: '18–23 Bulan',
    icon: 'solar:running-round-outline',
    motorikKasar: 'Ajak berlari, melompat, dan bermain lempar tangkap bola. Latih menendang bola ke depan.',
    motorikHalus: 'Ajari menggambar garis lurus, menyusun puzzle sederhana, dan membuka halaman buku.',
    bicara: 'Dorong anak berbicara dalam kalimat 2 kata, ajukan pertanyaan sederhana, dengarkan dengan sabar.',
    sosial: 'Ajari anak melepas pakaian sendiri, bermain bersama anak lain, dan membantu pekerjaan rumah ringan.',
  },
  {
    ageLabel: '24–35 Bulan',
    icon: 'solar:running-round-outline',
    motorikKasar: 'Ajak berlari, melompat dengan dua kaki, bersepeda roda tiga, dan memanjat tangga.',
    motorikHalus: 'Ajari menggambar lingkaran, menggunting garis lurus, menyusun 6 buah balok.',
    bicara: 'Latih anak berbicara kalimat 3–4 kata, ajak berdiskusi tentang gambar di buku, ceritakan dongeng.',
    sosial: 'Ajarkan berbagi mainan, bermain peran (masak-masakan, dokter-dokteran), dan konsep malu/maaf.',
  },
  {
    ageLabel: '36–47 Bulan',
    icon: 'solar:kid-outline',
    motorikKasar: 'Ajak melompat dengan satu kaki, berdiri di atas satu kaki, bermain lempar tangkap bola kecil.',
    motorikHalus: 'Ajari menggambar orang dengan 3 bagian tubuh, menggunting pola sederhana, mewarnai gambar.',
    bicara: 'Ajak bercakap-cakap tentang kejadian sehari-hari, kenalkan huruf dan angka secara menyenangkan.',
    sosial: 'Ajari anak berpakaian sendiri, gosok gigi dengan pantauan, bermain kooperatif dengan teman sebaya.',
  },
  {
    ageLabel: '48–59 Bulan',
    icon: 'solar:kid-outline',
    motorikKasar: 'Ajak bersepeda, bermain lompat tali, berlatih keseimbangan di balok titian.',
    motorikHalus: 'Ajari menulis nama, menggambar orang lengkap, membuat origami sederhana.',
    bicara: 'Ajak bercerita tentang pengalaman, kenalkan konsep baca-tulis awal, ajari lagu dan puisi.',
    sosial: 'Ajari anak bergantian dan antri, menyelesaikan konflik dengan kata-kata, memahami aturan permainan.',
  },
  {
    ageLabel: '60–72 Bulan',
    icon: 'solar:kid-outline',
    motorikKasar: 'Ajak olahraga rutin (lari, berenang, bersepeda), latih koordinasi mata-tangan melalui permainan.',
    motorikHalus: 'Latih menulis dan menggambar dengan detail, membuat kerajinan tangan sederhana.',
    bicara: 'Dorong anak membaca buku bergambar sendiri, bercerita ulang isi cerita, belajar konsep angka dan huruf.',
    sosial: 'Ajarkan tanggung jawab ringan di rumah, bermain dalam kelompok, mengenal konsep benar-salah dan empati.',
  },
];

const STIMULASI_ASPECTS = [
  { key: 'motorikKasar', label: 'Motorik Kasar', icon: 'solar:running-round-outline', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
  { key: 'motorikHalus', label: 'Motorik Halus', icon: 'solar:hand-stars-outline', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' },
  { key: 'bicara',       label: 'Bicara & Bahasa', icon: 'solar:chat-round-dots-outline', color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
  { key: 'sosial',       label: 'Sosial & Kemandirian', icon: 'solar:users-group-rounded-outline', color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20' },
];

const FoodCard = ({
  item,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
}: {
  item: FoodItem;
  canEdit?: boolean;
  canDelete?: boolean;
  onEdit?: (item: FoodItem) => void;
  onDelete?: (item: FoodItem) => void;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${CATEGORY_COLORS[item.category] ?? 'bg-gray-100 text-gray-600'}`}>
          <Icon icon={CATEGORY_ICONS[item.category] ?? 'solar:plate-outline'} width={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{item.name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${CATEGORY_COLORS[item.category] ?? 'bg-gray-100 text-gray-600'}`}>
              {CATEGORY_LABELS[item.category] ?? item.category}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
            {item.nutritional_info}
          </p>
          {item.recipe && (
            <div className="mt-2">
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-[#0152EA] font-medium flex items-center gap-1 hover:underline"
              >
                <Icon icon={expanded ? "solar:alt-arrow-up-outline" : "solar:alt-arrow-down-outline"} width={12} />
                {expanded ? "Sembunyikan resep" : "Lihat resep"}
              </button>
              {expanded && (
                <div className="mt-2 p-3 bg-gray-50 dark:bg-darkminisidebar rounded-lg text-xs text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                  {item.recipe}
                </div>
              )}
            </div>
          )}
        </div>
        {(canEdit || canDelete) && (
          <div className="flex flex-col gap-1.5">
            {canEdit && (
              <button
                onClick={() => onEdit?.(item)}
                className="w-8 h-8 rounded-lg border border-gray-200 dark:border-darkborder flex items-center justify-center text-gray-500 hover:text-[#0152EA] hover:border-[#0152EA]"
              >
                <Icon icon="solar:pen-outline" width={14} />
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => onDelete?.(item)}
                className="w-8 h-8 rounded-lg border border-gray-200 dark:border-darkborder flex items-center justify-center text-gray-500 hover:text-red-600 hover:border-red-400"
              >
                <Icon icon="solar:trash-bin-trash-outline" width={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface FoodFormDialogProps {
  open: boolean;
  onClose: () => void;
  food: FoodItem | null;
  onSubmit: (data: CreateFoodRequest) => void;
  isPending?: boolean;
}

const buildInitialFoodForm = (food: FoodItem | null): CreateFoodRequest => {
  if (!food) {
    return {
      name: "",
      category: "umum",
      nutritional_info: "",
      recipe: "",
      image: null,
    };
  }

  return {
    name: food.name,
    category: food.category,
    nutritional_info: food.nutritional_info,
    recipe: food.recipe ?? "",
    image: null,
  };
};

const FoodFormDialog = ({ open, onClose, food, onSubmit, isPending = false }: FoodFormDialogProps) => {
  const [form, setForm] = useState<CreateFoodRequest>(buildInitialFoodForm(food));
  const [selectedImageName, setSelectedImageName] = useState<string>("");

  const submit = () => {
    if (!form.name.trim() || !form.nutritional_info.trim()) return;
    onSubmit({
      ...form,
      recipe: form.recipe?.trim() || null,
      image: form.image ?? null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{food ? "Edit Makanan" : "Tambah Makanan"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Nama Makanan</Label>
            <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Contoh: Telur rebus" />
          </div>
          <div className="space-y-1.5">
            <Label>Kategori</Label>
            <select
              className="w-full h-9 px-3 text-sm border border-gray-200 dark:border-darkborder rounded-lg bg-white dark:bg-darkgray"
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            >
              <option value="umum">Umum</option>
              <option value="stunting">Stunting</option>
              <option value="tinggi">Tinggi Badan</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Info Nutrisi</Label>
            <Textarea value={form.nutritional_info} onChange={(e) => setForm((p) => ({ ...p, nutritional_info: e.target.value }))} placeholder="Kandungan gizi makanan..." className="min-h-[80px]" />
          </div>
          <div className="space-y-1.5">
            <Label>Resep</Label>
            <Textarea value={form.recipe ?? ""} onChange={(e) => setForm((p) => ({ ...p, recipe: e.target.value }))} placeholder="Cara penyajian/resep (opsional)" className="min-h-[80px]" />
          </div>
          <div className="space-y-1.5">
            <Label>Gambar</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setForm((p) => ({ ...p, image: file }));
                setSelectedImageName(file?.name ?? "");
              }}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {selectedImageName
                ? `File dipilih: ${selectedImageName}`
                : food?.image
                  ? "Kosongkan jika tidak ingin mengubah gambar lama"
                  : "Format: JPG, PNG, WEBP (maks 2MB)"}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>Batal</Button>
          <Button onClick={submit} disabled={isPending || !form.name.trim() || !form.nutritional_info.trim()} className="bg-[#0152EA] hover:bg-blue-700 text-white">
            {isPending && <Icon icon="solar:refresh-line-duotone" className="mr-2 animate-spin" width={14} />}
            {food ? "Simpan" : "Tambah"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const StimulationSection = () => {
  const [selectedAge, setSelectedAge] = useState(0);
  const current = STIMULASI_DATA[selectedAge];

  return (
    <div className="space-y-4">
      {/* Age group selector */}
      <div className="flex flex-wrap gap-2">
        {STIMULASI_DATA.map((s, i) => (
          <button
            key={i}
            onClick={() => setSelectedAge(i)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              selectedAge === i
                ? 'bg-[#0152EA] text-white border-[#0152EA]'
                : 'bg-white dark:bg-darkgray text-gray-600 dark:text-gray-400 border-gray-200 dark:border-darkborder hover:border-[#0152EA] hover:text-[#0152EA]'
            }`}
          >
            {s.ageLabel}
          </button>
        ))}
      </div>

      {/* Selected age content */}
      <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-5">
        <div className="flex items-center gap-2 mb-4">
          <Icon icon={current.icon} width={20} className="text-[#0152EA]" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Kelompok Usia {current.ageLabel}</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {STIMULASI_ASPECTS.map((aspect) => (
            <div key={aspect.key} className={`rounded-lg p-3 ${aspect.color.split(' ').slice(1).join(' ')}`}>
              <div className="flex items-center gap-2 mb-1.5">
                <Icon icon={aspect.icon} width={15} className={aspect.color.split(' ')[0]} />
                <p className={`text-xs font-semibold uppercase tracking-wide ${aspect.color.split(' ')[0]}`}>{aspect.label}</p>
              </div>
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                {current[aspect.key as keyof typeof current] as string}
              </p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500">
        Sumber: Buku Bagan SDIDTK Kemenkes RI 2022 — Tabel 3 Intervensi Dini Penyimpangan Perkembangan
      </p>
    </div>
  );
};

const FoodRecommendationPage = () => {
  const { hasPermission } = usePermission();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'makanan' | 'stimulasi'>('makanan');
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);
  const [deletingFood, setDeletingFood] = useState<FoodItem | null>(null);

  const canCreateFood = hasPermission(PERMISSIONS.FOODS_CREATE);
  const canUpdateFood = hasPermission(PERMISSIONS.FOODS_UPDATE);
  const canDeleteFood = hasPermission(PERMISSIONS.FOODS_DELETE);

  const { data, isLoading } = useGetFoods(
    categoryFilter !== "all" ? { category: categoryFilter, search: search || undefined } : { search: search || undefined }
  );
  const foods = data?.data?.data ?? [];

  const createFoodMutation = useCreateFood({
    onSuccess: () => {
      toast.success("Makanan berhasil ditambahkan");
      setIsFormOpen(false);
      setEditingFood(null);
    },
    onError: () => toast.error("Gagal menambahkan makanan"),
  });

  const updateFoodMutation = useUpdateFood({
    onSuccess: () => {
      toast.success("Makanan berhasil diperbarui");
      setIsFormOpen(false);
      setEditingFood(null);
    },
    onError: () => toast.error("Gagal memperbarui makanan"),
  });

  const deleteFoodMutation = useDeleteFood({
    onSuccess: () => {
      toast.success("Makanan berhasil dihapus");
      setDeletingFood(null);
    },
    onError: () => toast.error("Gagal menghapus makanan"),
  });

  const foodCategories = [
    { value: "all", label: "Semua", icon: "solar:list-outline" },
    { value: "umum", label: "Umum", icon: CATEGORY_ICONS.umum },
    { value: "stunting", label: "Stunting", icon: CATEGORY_ICONS.stunting },
    { value: "tinggi", label: "Tinggi Badan", icon: CATEGORY_ICONS.tinggi },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Saran Makanan & Tindakan</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Rekomendasi makanan bergizi dan stimulasi tumbuh kembang anak</p>
      </div>

      {canCreateFood && (
        <div className="flex items-center justify-end">
          <Button
            className="bg-[#0152EA] hover:bg-blue-700 text-white gap-2"
            onClick={() => {
              setEditingFood(null);
              setIsFormOpen(true);
            }}
          >
            <Icon icon="solar:add-circle-outline" width={16} />
            Tambah Makanan
          </Button>
        </div>
      )}

      {/* Tab switch */}
      <div className="flex gap-1 bg-gray-100 dark:bg-darkminisidebar rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveTab('makanan')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'makanan'
              ? 'bg-white dark:bg-darkgray text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
          }`}
        >
          <Icon icon="solar:plate-outline" width={16} />
          Saran Makanan
        </button>
        <button
          onClick={() => setActiveTab('stimulasi')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'stimulasi'
              ? 'bg-white dark:bg-darkgray text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
          }`}
        >
          <Icon icon="solar:running-round-outline" width={16} />
          Stimulasi Tumbuh Kembang
        </button>
      </div>

      {activeTab === 'makanan' ? (
        <>
          {/* Info banner */}
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-xl p-4 flex gap-3">
            <Icon icon="solar:info-circle-outline" width={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Kategori Makanan</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                <strong>Umum</strong> — baik untuk semua anak. <strong>Stunting</strong> — direkomendasikan untuk anak dengan status stunted/severely stunted. <strong>Tinggi Badan</strong> — mendukung pertumbuhan tinggi badan optimal.
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Icon icon="solar:magnifier-outline" width={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari makanan..."
                className="w-full h-9 pl-9 pr-3 text-sm border border-gray-200 dark:border-darkborder rounded-lg bg-white dark:bg-darkgray text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-1 bg-gray-100 dark:bg-darkminisidebar rounded-lg p-1 w-fit">
              {foodCategories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategoryFilter(cat.value)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    categoryFilter === cat.value
                      ? 'bg-white dark:bg-darkgray text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                  }`}
                >
                  <Icon icon={cat.icon} width={13} />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {!isLoading && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{foods.length} makanan ditemukan</p>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder p-4 animate-pulse h-24" />
              ))}
            </div>
          ) : foods.length === 0 ? (
            <div className="bg-white dark:bg-darkgray rounded-xl border border-gray-200 dark:border-darkborder py-16 text-center">
              <Icon icon="solar:magnifier-outline" width={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400">Tidak ada makanan ditemukan</p>
              {search && (
                <button onClick={() => setSearch("")} className="text-sm text-[#0152EA] mt-2 hover:underline">
                  Hapus pencarian
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {foods.map((item) => (
                <FoodCard
                  key={item.id}
                  item={item}
                  canEdit={canUpdateFood}
                  canDelete={canDeleteFood}
                  onEdit={(food) => {
                    setEditingFood(food);
                    setIsFormOpen(true);
                  }}
                  onDelete={setDeletingFood}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {/* Info banner stimulasi */}
          <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800/30 rounded-xl p-4 flex gap-3">
            <Icon icon="solar:info-circle-outline" width={20} className="text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-purple-800 dark:text-purple-300">Stimulasi Tumbuh Kembang</p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-0.5">
                Pilih kelompok usia anak untuk melihat panduan stimulasi motorik kasar, motorik halus, bicara & bahasa, serta sosial dan kemandirian sesuai SDIDTK Kemenkes 2022.
              </p>
            </div>
          </div>

          <StimulationSection />
        </>
      )}

      <FoodFormDialog
        key={`${editingFood ? `edit-${editingFood.id}` : 'create'}-${isFormOpen ? 'open' : 'closed'}`}
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingFood(null);
        }}
        food={editingFood}
        onSubmit={(payload) => {
          if (editingFood) {
            if (!canUpdateFood) {
              toast.error("Tidak memiliki akses untuk mengubah makanan");
              return;
            }
            updateFoodMutation.mutate({ id: editingFood.id, data: payload });
            return;
          }
          if (!canCreateFood) {
            toast.error("Tidak memiliki akses untuk menambah makanan");
            return;
          }
          createFoodMutation.mutate(payload);
        }}
        isPending={createFoodMutation.isPending || updateFoodMutation.isPending}
      />

      <AlertDialog open={!!deletingFood} onOpenChange={() => setDeletingFood(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Makanan?</AlertDialogTitle>
            <AlertDialogDescription>
              Data makanan {deletingFood?.name ? `"${deletingFood.name}"` : "ini"} akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (!canDeleteFood) {
                  toast.error("Tidak memiliki akses untuk menghapus makanan");
                  return;
                }
                if (deletingFood) {
                  deleteFoodMutation.mutate(deletingFood.id);
                }
              }}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FoodRecommendationPage;
