//data/familias.ts

export type Family = {
  id: string;
  nombreFamilia: string;
  nroPersonas: number;
};

export const FAMILIAS: Family[] = [
  { id: "fam-ulloa-marquez", 
    nombreFamilia: "Familia Ulloa Márquez", 
    nroPersonas: 2 },
  { id: "fam-villamagua-torres", 
    nombreFamilia: "Familia Villamagua Torres", 
    nroPersonas: 5 },
  { id: "fam-salinas-marquez", 
    nombreFamilia: "Familia Salinas Márquez", 
    nroPersonas: 3 },
];
