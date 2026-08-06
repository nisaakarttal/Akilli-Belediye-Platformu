"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  FolderKanban,
  LayoutGrid,
  List,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useMemo } from "react";

import { IstatistikKarti } from "@/components/admin/istatistik-karti";
import { KategoriFormu } from "@/components/admin/kategori-formu";
import { KategoriKarti } from "@/components/admin/kategori-karti";
import { KategoriTablosu } from "@/components/admin/kategori-tablosu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Uyari } from "@/components/ui/uyari";
import { TamSayfaYukleniyor } from "@/components/ui/yukleniyor";

import { useAdminKategoriler } from "@/hooks/use-admin-kategoriler";
import { cn } from "@/lib/utils";


export default function YoneticiKategorilerSayfasi() {
  const {
    form,
    setForm,
    duzenlenenId,
    hata,
    basari,

    aramaMetni,
    setAramaMetni,

    gorunumModu,
    setGorunumModu,

    kategoriler,
    isLoading,
    isRefetching,

    refetch,

    kaydetMutation,
    silMutation,

    filtrelenmisKategoriler,
    aktifDepartmanSayisi,

    duzenlemeyeBasla,
    formuSifirla,
    handleSubmit,
    handleSil,
  } = useAdminKategoriler();


  const kategoriSayisi = useMemo(
    () => filtrelenmisKategoriler.length,
    [filtrelenmisKategoriler]
  );


  return (
    <main
      className="space-y-8 pb-24 pt-2"
      aria-label="Kategori yönetim paneli"
    >


      {/* HEADER */}
      <section
        className="
        relative overflow-hidden rounded-3xl
        border border-kenarlik
        bg-zemin/70
        p-6 shadow-2xl
        backdrop-blur-2xl
        sm:p-10
        "
      >

        <div
          className="
          pointer-events-none absolute
          -right-24 -top-24
          h-96 w-96
          rounded-full
          bg-birincil-500/10
          blur-[120px]
          "
        />


        <div
          className="
          pointer-events-none absolute
          -bottom-24 -left-24
          h-96 w-96
          rounded-full
          bg-ikincil-500/10
          blur-[120px]
          "
        />


        <div
          className="
          relative z-10
          flex flex-col gap-6
          lg:flex-row
          lg:items-center
          lg:justify-between
          "
        >

          <div className="space-y-4">


            <div className="flex flex-wrap gap-2">


              <span
                className="
                inline-flex items-center gap-2
                rounded-full
                border border-birincil-500/20
                bg-birincil-600/10
                px-3 py-1
                text-xs font-black
                text-birincil-600
                "
              >
                <Sparkles size={13}/>
                Kategori Taksonomisi
              </span>



              <span
                className="
                inline-flex items-center gap-2
                rounded-full
                border border-basarili/20
                bg-basarili/10
                px-3 py-1
                text-xs font-bold
                text-green-600
                "
              >
                <ShieldCheck size={13}/>
                Otomatik Sevk Kanalları
              </span>


            </div>



            <h1
              className="
              text-3xl
              font-black
              tracking-tight
              text-metin
              sm:text-4xl
              "
            >
              Kategori Yönetim Paneli
            </h1>


            <p
              className="
              max-w-2xl
              text-sm
              font-medium
              leading-relaxed
              text-metin-ikincil
              "
            >
              Şikâyet ve taleplerin yönlendirileceği
              kurumsal departman kategorilerini yönetin.
            </p>


          </div>



          <Button
            varyant="anahat"
            disabled={isRefetching}
            onClick={() => refetch()}
            className="gap-2"
          >

            <RefreshCw
              size={16}
              className={cn(
                isRefetching && "animate-spin"
              )}
            />

            Yenile

          </Button>


        </div>

      </section>




      {/* STATISTICS */}

      <section
        className="
        grid
        grid-cols-1
        gap-5
        md:grid-cols-3
        "
      >

        <IstatistikKarti
          ikon={FolderKanban}
          etiket="Toplam Kategori"
          deger={kategoriler.length}
          vurgu="birincil"
          aciklama="Aktif tanımlı"
        />


        <IstatistikKarti
          ikon={Building2}
          etiket="Sorumlu Birimler"
          deger={aktifDepartmanSayisi}
          vurgu="ikincil"
          aciklama="Farklı müdürlük"
        />


        <IstatistikKarti
          ikon={CheckCircle2}
          etiket="Sistem Durumu"
          deger="Aktif"
          vurgu="basarili"
          aciklama="%100 operasyonel"
        />


      </section>




      {/* ALERT */}

      <AnimatePresence mode="wait">

        {hata && (
          <motion.div
            initial={{opacity:0,y:-10}}
            animate={{opacity:1,y:0}}
            exit={{opacity:0,y:-10}}
          >
            <Uyari tur="hata">
              {hata}
            </Uyari>
          </motion.div>
        )}


        {basari && (
          <motion.div
            initial={{opacity:0,y:-10}}
            animate={{opacity:1,y:0}}
            exit={{opacity:0,y:-10}}
          >
            <Uyari tur="basari">
              {basari}
            </Uyari>
          </motion.div>
        )}


      </AnimatePresence>





      {/* FORM */}

      <KategoriFormu
        form={form}
        onFormDegistir={setForm}
        duzenlenenId={duzenlenenId}
        kaydediliyorMu={kaydetMutation.isPending}
        onSubmit={handleSubmit}
        onIptal={formuSifirla}
      />






      {/* FILTER BAR */}

      <section
        className="
        flex flex-col gap-4
        rounded-2xl
        border border-kenarlik
        bg-zemin
        p-3
        shadow-md
        sm:flex-row
        sm:items-center
        sm:justify-between
        "
      >


        <div className="relative flex-1">

          <Search
            size={17}
            className="
            absolute left-3.5 top-1/2
            -translate-y-1/2
            text-metin-ikincil
            "
          />


          <Input
            value={aramaMetni}
            onChange={(e)=>setAramaMetni(e.target.value)}
            placeholder="Kategori veya müdürlük ara..."
            className="
            border-0
            bg-black/5
            pl-10
            dark:bg-white/5
            "
          />


          {aramaMetni && (

            <button
              onClick={()=>setAramaMetni("")}
              className="
              absolute right-3.5 top-1/2
              -translate-y-1/2
              "
              aria-label="Aramayı temizle"
            >

              <X size={15}/>

            </button>

          )}


        </div>




        <div
          className="
          flex rounded-xl
          border border-kenarlik
          bg-black/5
          p-1
          dark:bg-white/5
          "
        >


          {[
            {
              id:"grid",
              icon:LayoutGrid,
              text:"Grid"
            },
            {
              id:"table",
              icon:List,
              text:"Tablo"
            }
          ].map((item)=>{

            const Icon=item.icon;

            return (

              <button
                key={item.id}
                onClick={()=>
                  setGorunumModu(
                    item.id as "grid"|"table"
                  )
                }
                className={cn(
                  `
                  flex items-center gap-2
                  rounded-lg px-4 py-2
                  text-xs font-black
                  transition-all
                  `,
                  gorunumModu===item.id
                    ?
                    "bg-zemin text-birincil-600 shadow"
                    :
                    "text-metin-ikincil hover:text-metin"
                )}
              >

                <Icon size={15}/>
                {item.text}

              </button>

            )

          })}


        </div>


      </section>







      {/* CONTENT */}

      {isLoading ? (

        <TamSayfaYukleniyor/>

      ) : kategoriSayisi===0 ? (

        <section
          className="
          rounded-3xl
          border border-dashed
          border-kenarlik
          bg-zemin/40
          p-12
          text-center
          "
        >

          <AlertCircle
            size={32}
            className="mx-auto mb-3 text-metin-ikincil"
          />

          <h3 className="font-black text-metin">
            Kategori Bulunamadı
          </h3>


          <p className="mt-2 text-sm text-metin-ikincil">

            {aramaMetni
              ?
              `"${aramaMetni}" için sonuç bulunamadı.`
              :
              "Henüz kategori oluşturulmamış."
            }

          </p>


        </section>


      ) : gorunumModu==="grid" ? (


        <div
          className="
          grid
          grid-cols-1
          gap-6
          md:grid-cols-2
          lg:grid-cols-3
          "
        >


          <AnimatePresence>


            {filtrelenmisKategoriler.map((kategori)=>(

              <motion.div
                key={kategori.id}
                layout
                initial={{
                  opacity:0,
                  y:20
                }}
                animate={{
                  opacity:1,
                  y:0
                }}
                exit={{
                  opacity:0,
                  scale:.95
                }}
                transition={{
                  duration:.25
                }}
              >

                <KategoriKarti
                  kategori={kategori}
                  onDuzenle={()=>
                    duzenlemeyeBasla(kategori)
                  }
                  onSil={()=>
                    handleSil(
                      kategori.id,
                      kategori.ad
                    )
                  }
                  silinebilirMi={
                    !silMutation.isPending
                  }
                />


              </motion.div>

            ))}


          </AnimatePresence>


        </div>



      ) : (


        <KategoriTablosu
          kategoriler={filtrelenmisKategoriler}
          onDuzenle={duzenlemeyeBasla}
          onSil={handleSil}
        />


      )}



    </main>
  );
}