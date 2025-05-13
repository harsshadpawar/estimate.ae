// Define type interfaces
interface MaterialGroup {
    id: string;
    name: string;
}

interface Material {
    id?: string;
    name: string;
    material_number: string;
    price_per_kg: number;
    refund_per_kg: number;
    density: number;
    co2_emission: number;
    active: boolean;
    material_group_id: string;
}

interface MaterialFormDialogProps {
    open: boolean;
    material?: Material | null | undefined;
    onDialogClose: () => void;
    onSaveMaterial: (material: Material) => void | Promise<void>;
    materialGroups: MaterialGroup[];
}