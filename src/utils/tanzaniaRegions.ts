// Tanzania Regions and Districts Data
export const tanzaniaRegionsAndDistricts: { [key: string]: string[] } = {
  "Arusha": [
    "Arusha City",
    "Arusha District",
    "Karatu",
    "Longido",
    "Meru",
    "Monduli",
    "Ngorongoro"
  ],
  "Dar es Salaam": [
    "Ilala",
    "Kinondoni",
    "Temeke",
    "Ubungo",
    "Kigamboni"
  ],
  "Dodoma": [
    "Dodoma City",
    "Dodoma Urban",
    "Bahi",
    "Chamwino",
    "Chemba",
    "Kondoa",
    "Kongwa",
    "Mpwapwa"
  ],
  "Geita": [
    "Geita",
    "Bukombe",
    "Chato",
    "Mbogwe",
    "Nyang'hwale"
  ],
  "Iringa": [
    "Iringa Urban",
    "Iringa District",
    "Kilolo",
    "Mafinga",
    "Mufindi"
  ],
  "Kagera": [
    "Bukoba Urban",
    "Bukoba Rural",
    "Biharamulo",
    "Chato",
    "Karagwe",
    "Kyerwa",
    "Missenyi",
    "Muleba",
    "Ngara"
  ],
  "Katavi": [
    "Mpanda",
    "Mlele",
    "Nsimbo"
  ],
  "Kigoma": [
    "Kigoma Urban",
    "Kigoma Rural",
    "Buhigwe",
    "Kakonko",
    "Kasulu",
    "Kibondo",
    "Uvinza"
  ],
  "Kilimanjaro": [
    "Moshi Urban",
    "Moshi Rural",
    "Hai",
    "Mwanga",
    "Rombo",
    "Same",
    "Siha"
  ],
  "Lindi": [
    "Lindi Urban",
    "Lindi Rural",
    "Kilwa",
    "Liwale",
    "Nachingwea",
    "Ruangwa"
  ],
  "Manyara": [
    "Babati",
    "Hanang",
    "Kiteto",
    "Mbulu",
    "Simanjiro"
  ],
  "Mara": [
    "Musoma Urban",
    "Musoma Rural",
    "Bunda",
    "Butiama",
    "Rorya",
    "Serengeti",
    "Tarime"
  ],
  "Mbeya": [
    "Mbeya City",
    "Mbeya District",
    "Chunya",
    "Ileje",
    "Kyela",
    "Mbarali",
    "Mbozi",
    "Rungwe"
  ],
  "Mjini Magharibi": [
    "Zanzibar Urban/West",
    "Zanzibar North",
    "Zanzibar South"
  ],
  "Morogoro": [
    "Morogoro Urban",
    "Morogoro Rural",
    "Gairo",
    "Kilombero",
    "Kilosa",
    "Mvomero",
    "Ulanga"
  ],
  "Mtwara": [
    "Mtwara Urban",
    "Mtwara Rural",
    "Masasi",
    "Nanyumbu",
    "Newala",
    "Tandahimba"
  ],
  "Mwanza": [
    "Mwanza City",
    "Ilemela",
    "Kwimba",
    "Magu",
    "Misungwi",
    "Nyamagana",
    "Sengerema",
    "Ukerewe"
  ],
  "Njombe": [
    "Njombe Urban",
    "Njombe Rural",
    "Ludewa",
    "Makambako",
    "Makete",
    "Wanging'ombe"
  ],
  "Pemba North": [
    "Micheweni",
    "Wete"
  ],
  "Pemba South": [
    "Chake Chake",
    "Mkoani"
  ],
  "Pwani": [
    "Kibaha",
    "Bagamoyo",
    "Kibiti",
    "Kisarawe",
    "Mafia",
    "Mkuranga",
    "Rufiji"
  ],
  "Rukwa": [
    "Sumbawanga Urban",
    "Sumbawanga Rural",
    "Kalambo",
    "Nkasi"
  ],
  "Ruvuma": [
    "Songea Urban",
    "Songea Rural",
    "Mbinga",
    "Namtumbo",
    "Nyasa",
    "Tunduru"
  ],
  "Shinyanga": [
    "Shinyanga Urban",
    "Shinyanga Rural",
    "Kahama",
    "Kishapu",
    "Msalala"
  ],
  "Simiyu": [
    "Bariadi",
    "Busega",
    "Itilima",
    "Maswa",
    "Meatu"
  ],
  "Singida": [
    "Singida Urban",
    "Singida Rural",
    "Iramba",
    "Manyoni",
    "Mkalama"
  ],
  "Songwe": [
    "Mbozi",
    "Momba",
    "Songwe"
  ],
  "Tabora": [
    "Tabora Urban",
    "Tabora Rural",
    "Igunga",
    "Kaliua",
    "Nzega",
    "Sikonge",
    "Urambo",
    "Uyui"
  ],
  "Tanga": [
    "Tanga City",
    "Tanga District",
    "Handeni",
    "Kilindi",
    "Korogwe",
    "Lushoto",
    "Mkinga",
    "Muheza",
    "Pangani"
  ]
};

export const regions = Object.keys(tanzaniaRegionsAndDistricts).sort();

export const getDistrictsByRegion = (region: string): string[] => {
  return tanzaniaRegionsAndDistricts[region] || [];
};

