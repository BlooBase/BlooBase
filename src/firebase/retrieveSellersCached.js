import { ref, getDownloadURL } from "firebase/storage";
import { storage,apiRequest } from "./firebase";
import { cachedSellers } from "./retrieveSellers"; // optional separate file}

// Hardcoded fallback sellers
export const hardcodedSellers = [
  {
    id: "h1",
    title: "poiandkeely",
    image: "/keely.jpg",
    description: "3d Modeling and Character Design, @poiandkeely",
    color: "#FFEFF8",
    textColor: "#A38FF7",
    genre: "Digital Art",
  },
  {
    id: "h2",
    title: "Inio Asano",
    image: "/Asano.jpg",
    description: "Author and artist of 'Goodnight Punpun', 'Solanin' and 'A Girl On the Shore'.",
    color: "#ffffff",
    textColor: "#598EA0",
    genre: "Art",
  },
  {
    id: "h3",
    title: "조기석 Cho Gi-Seok",
    image: "/Chogiseok.jpg",
    description: "Korean photographer, director and artisan, @chogiseok",
    color: "#e7e4d7",
    textColor: "#141118",
    genre: "Digital Art",
  },
  {
    id: "h4",
    title: "Yusuke Murata",
    image: "/Murata.gif",
    description: "Artist of 'One Punch Man' and 'Eyeshield 21'.",
    color: "#1e1e1e",
    textColor: "#ffffff",
    genre: "Art",
  },
  {
    id: "h5",
    title: "Inspired Island",
    image: "/Island.jpg",
    description: "Digital Media editor, artist and director, @CultureStudios",
    color: "#8C2C54",
    textColor: "#FFDFE2",
    genre: "Digital Art",
  },
  {
    id: "h6",
    title: "Jamie Hewlett",
    image: "/Hewlett.jpg",
    description: "Digital Artist - @Hewll",
    color: "#1c6e7b",
    textColor: "#ffffff",
    genre: "Digital Art",
  },
  {
    id: "h7",
    title: "Kim Jung Gi",
    image: "/Kim.jpg",
    description: "Physical inking artist and illustrator",
    color: "#ffffff",
    textColor: "#181818",
    genre: "Art",
  },
];

export async function retrieveSellersCached() {
  try {
    if (cachedSellers) {
      return cachedSellers;
    }
    const sellers = await apiRequest("/api/sellers", "GET");

    const sellersWithUrls = await Promise.all(
      sellers.map(async (seller) => {
        let imageUrl = seller.image;
        if (imageUrl && !imageUrl.startsWith("http")) {
          try {
            const imageRef = ref(storage, imageUrl);
            imageUrl = await getDownloadURL(imageRef);
          } catch (err) {
            console.error(`Error fetching image for seller ${seller.id}:`, err);
          }
        }

        return {
          ...seller,
          image: imageUrl,
        };
      })
    );

    return [...hardcodedSellers, ...sellersWithUrls];
  } catch (error) {
    console.error("Error retrieving sellers:", error);
    return hardcodedSellers;
  }
}
