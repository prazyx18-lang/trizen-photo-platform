import { useEffect, useState } from "react";

function Photos() {

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);


  // GET EVENTS
  useEffect(() => {

    const fetchEvents = async () => {

      try {

        const token = localStorage.getItem("token");

        const response = await fetch(
         "https://trizen-photo-platform-api.onrender.com/api/events",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (response.ok) {
          setEvents(data);
        }

      } catch (error) {

        
        console.error(error);

      }

    };

    fetchEvents();

  }, []);


  // GET PHOTOS FOR EVENT
  const fetchPhotos = async (eventId) => {

    if (!eventId) {

      setPhotos([]);

      return;

    }

    try {

      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://trizen-photo-platform-api.onrender.com/api/events/${eventId}/photos`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        setPhotos(data);
      }

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };


  // SELECT EVENT
  const handleEventChange = (eventId) => {

    setSelectedEvent(eventId);

    fetchPhotos(eventId);

  };


  // UPLOAD MULTIPLE PHOTOS
const handleUpload = async (e) => {

    e.preventDefault();

    if (!selectedEvent) {

        alert("Please select an event");

        return;

    }

    if (selectedPhotos.length === 0) {

        alert("Please select at least one photo");

        return;

    }


    try {

        setLoading(true);

        const token = localStorage.getItem("token");

        const formData = new FormData();


        // Add all selected photos
        selectedPhotos.forEach((photo) => {

            formData.append("photos", photo);

        });


        const response = await fetch(

            `https://trizen-photo-platform-api.onrender.com/api/events/${selectedEvent}/photos`,

            {
                method: "POST",

                headers: {
                    Authorization: `Bearer ${token}`
                },

                body: formData
            }

        );

const responseText = await response.text();

let data;

try {

    data = JSON.parse(responseText);

} catch (error) {

    console.error("SERVER RESPONSE:", responseText);

    alert("Upload failed. Check Render Logs.");

    return;

}


if (!response.ok) {

    alert(data.message || "Upload failed");

    return;

}


        alert(
            `${data.count} photo(s) uploaded successfully 🎉`
        );


        // Clear selected photos
        setSelectedPhotos([]);


        // Refresh photos
        fetchPhotos(selectedEvent);


    } catch (error) {

    console.error("UPLOAD ERROR:", error);

    alert(error.message || "Something went wrong");

}finally {

        setLoading(false);

    }

};

  return (

    <div style={{ padding: "40px" }}>

      <h1>📸 Photos Management</h1>

      <p>Upload and manage event photos.</p>


      {/* SELECT EVENT */}

      <div style={{ marginTop: "30px" }}>

        <h3>Select Event</h3>

        <select
          value={selectedEvent}
          onChange={(e) =>
            handleEventChange(e.target.value)
          }
          style={{
            padding: "12px",
            marginTop: "10px",
            width: "300px"
          }}
        >

          <option value="">
            Select an event
          </option>


          {events.map((event) => (

            <option
              key={event.id}
              value={event.id}
            >
              {event.name}
            </option>

          ))}

        </select>

      </div>


      {/* UPLOAD PHOTO */}

      <form
        onSubmit={handleUpload}
        style={{
          marginTop: "30px"
        }}
      >

        <h3>Upload Photo</h3>

        <input
    type="file"
    accept="image/*"
    multiple
    onChange={(e) =>
        setSelectedPhotos(Array.from(e.target.files))
    }
    style={{
        display: "block",
        marginTop: "10px"
    }}
        />


       <button
  type="submit"
  disabled={loading || selectedPhotos.length === 0}
  style={{
    marginTop: "15px",
    padding: "12px 25px",
    cursor: "pointer"
  }}
>
  {loading
    ? "Uploading..."
    : `📤 Upload ${selectedPhotos.length} Photos`
  }
</button>

      </form>


      <hr style={{ margin: "40px 0" }} />


      {/* DISPLAY PHOTOS */}

      <h2>Event Photos</h2>


      {loading ? (

        <p>Loading photos...</p>

      ) : photos.length === 0 ? (

        <p>Select an event to view photos.</p>

      ) : (

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            marginTop: "20px"
          }}
        >

     {photos.map((photo) => (

  <div
    key={photo.id}
    style={{
      width: "200px"
    }}
  >

    <img
      src={photo.storage_url}
      alt={photo.filename}
      onClick={() => {
        console.log("PHOTO CLICKED:", photo);
        setSelectedPhoto(photo);
      }}
      style={{
        width: "200px",
        height: "200px",
        objectFit: "cover",
        borderRadius: "10px",
        cursor: "pointer",
        display: "block"
      }}
    />

    <p>{photo.filename}</p>

  </div>

))}

        </div>

      )}
{selectedPhoto && (

  <div
    onClick={() => setSelectedPhoto(null)}
    style={{
      position: "fixed",
      inset: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.95)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999999
    }}
  >

    {/* CLOSE BUTTON */}

    <button
      onClick={() => setSelectedPhoto(null)}
      style={{
        position: "absolute",
        top: "20px",
        right: "30px",
        fontSize: "35px",
        color: "white",
        background: "none",
        border: "none",
        cursor: "pointer",
        zIndex: 1000000
      }}
    >
      ✕
    </button>


    {/* BIG PHOTO */}

    <img
      src={selectedPhoto.storage_url}
      alt={selectedPhoto.filename}
      onClick={(e) => e.stopPropagation()}
      style={{
        maxWidth: "90vw",
        maxHeight: "90vh",
        width: "auto",
        height: "auto",
        objectFit: "contain",
        borderRadius: "10px",
        display: "block"
      }}
    />

  </div>

)}

 </div>

  );

}

export default Photos;