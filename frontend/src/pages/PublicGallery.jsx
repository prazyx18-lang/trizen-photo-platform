import { useState } from "react";
import { useParams } from "react-router-dom";

function PublicGallery() {

  const { slug } = useParams();

  const [pin, setPin] = useState("");
  const [gallery, setGallery] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);


  // VERIFY PIN
  const handleVerifyPin = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const response = await fetch(
        `https://trizen-photo-platform-api.onrender.com/api/public/gallery/${slug}/verify-pin`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            pin
          })
        }
      );


      const data = await response.json();


      if (!response.ok) {

        alert(data.message);

        return;

      }


      // Get gallery token
      const galleryToken = data.galleryToken;


      // GET PUBLIC GALLERY
      const galleryResponse = await fetch(
        `https://trizen-photo-platform-api.onrender.com/api/public/gallery/${slug}`,
        {
          headers: {
            Authorization: `Bearer ${galleryToken}`
          }
        }
      );


      const galleryData =
        await galleryResponse.json();


      if (!galleryResponse.ok) {

        alert(galleryData.message);

        return;

      }


      // Save gallery and photos
      setGallery(galleryData.gallery);

      setPhotos(galleryData.photos);


    } catch (error) {

      console.error(error);

      alert("Something went wrong");

    } finally {

      setLoading(false);

    }

  };


  // PIN SCREEN
  if (!gallery) {

    return (

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f5f5f5"
        }}
      >

        <form
          onSubmit={handleVerifyPin}
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "12px",
            width: "350px",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
          }}
        >

          <h1>🔐 Private Gallery</h1>

          <p>
            Enter the PIN to view this gallery.
          </p>


          <input
            type="password"
            placeholder="Enter Gallery PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "20px"
            }}
          />


          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "20px",
              cursor: "pointer"
            }}
          >

            {loading
              ? "Verifying..."
              : "🔓 View Gallery"}

          </button>

        </form>

      </div>

    );

  }


  // GALLERY SCREEN
  return (

    <div
      style={{
        padding: "40px",
        minHeight: "100vh",
        background: "#f5f5f5"
      }}
    >

      <h1>{gallery.title}</h1>

      <p>📸 Private Photography Gallery</p>


      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
          marginTop: "30px"
        }}
      >

        {photos.map((photo) => (

          <div
            key={photo.id}
            style={{
              background: "white",
              padding: "10px",
              borderRadius: "10px"
            }}
          >

            <img
              src={photo.storage_url}
              alt={photo.filename}
              style={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
                borderRadius: "8px"
              }}
            />

          </div>

        ))}

      </div>

    </div>

  );

}

export default PublicGallery;