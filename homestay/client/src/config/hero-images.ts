// Existing Stock Images
import img1 from "@assets/stock_images/beautiful_himachal_p_50139e3f.jpg";
import img2 from "@assets/stock_images/beautiful_scenic_him_10b034ba.jpg";
import img3 from "@assets/stock_images/beautiful_scenic_him_3e373e25.jpg";
import img4 from "@assets/stock_images/beautiful_scenic_him_799557d0.jpg";

// New Batch (Tourism Dept 16)
import place1 from "@assets/scenic_places/Bird_eye_view_of_Pong_Dam_lake.jpg";
import place2 from "@assets/scenic_places/Buddha_statue_at_Langza_village.jpg";
import place3 from "@assets/scenic_places/Chitkul.jpg";
import place4 from "@assets/scenic_places/Gulaba_Manali.jpg";
import place5 from "@assets/scenic_places/Hatu_Peak_Narkanda.jpg";
import place6 from "@assets/scenic_places/Khajjiar_Chamba.jpg";
import place7 from "@assets/scenic_places/Langza_village.jpg";
import place8 from "@assets/scenic_places/Marhi_view_from_on_the_way_to_Rohtang-.jpg";
import place9 from "@assets/scenic_places/Naldehra_golf_course.jpg";
import place10 from "@assets/scenic_places/Renuka_ji_lake_at_Renuka_Sirmaur.jpg";
import place11 from "@assets/scenic_places/View_fromTriund_top.jpg";
import place12 from "@assets/scenic_places/View_from_Haripurdhar_Sirmaur.jpg";
import place13 from "@assets/scenic_places/View_from_Kaumik_village_Spiti.jpg";
import place14 from "@assets/scenic_places/view_from_Naddi_village.jpg";
import place15 from "@assets/scenic_places/view_of_Chitkul_valley.jpg";
import place16 from "@assets/scenic_places/view_of_Karsog_valley.jpg";
import place17 from "@assets/scenic_places/view_of_Kee_monastery.jpg";

// CM Image (Always first if enabled)
import cmImage from "@assets/stock_images/cm_sukhu_sukh_ki_sarkar.jpg";

const ALL_SCENIC_IMAGES = [
    // Original 4
    img1, img2, img3, img4,
    // New 17
    place1, place2, place3, place4, place5, place6, place7, place8,
    place9, place10, place11, place12, place13, place14, place15, place16, place17
];

export const getCmImage = () => cmImage;

export const getHeroImagesForTime = (): string[] => {
    const hour = new Date().getHours();
    // 4 Batches based on 6-hour windows: 0-6, 6-12, 12-18, 18-24
    // Total images: 21. ~5 per batch.

    // Scramble/Distribute them nicely so each batch has variety? 
    // For now, simpler sequential slices to ensure every image is shown at some point.

    const batchSize = Math.ceil(ALL_SCENIC_IMAGES.length / 4); // 21/4 = 6

    if (hour >= 0 && hour < 6) {
        // Night/Early Morning: Batch 1
        return ALL_SCENIC_IMAGES.slice(0, 6);
    } else if (hour >= 6 && hour < 12) {
        // Morning: Batch 2
        return ALL_SCENIC_IMAGES.slice(6, 12);
    } else if (hour >= 12 && hour < 18) {
        // Afternoon: Batch 3
        return ALL_SCENIC_IMAGES.slice(12, 17);
    } else {
        // Evening: Batch 4
        return ALL_SCENIC_IMAGES.slice(17);
    }
};
