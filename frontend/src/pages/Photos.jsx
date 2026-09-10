import { useEffect, useState } from "react";

function Photos() {

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);


  // GET EVENTS
  useEffect(() => {

    const fetchEvents = async () => {

      try {

        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:3000/api/events",
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
        `http://localhost:3000/api/events/${eventId}/photos`,
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


  // UPLOAD PHOTO
  const handleUpload = async (e) => {

    e.preventDefault();

    if (!selectedEvent) {

      alert("Please select an event");

      return;

    }

    if (!selectedPhoto) {

      alert("Please select a photo");

      return;

    }


    try {

      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("photo", selectedPhoto);


      const response = await fetch(
        `http://localhost:3000/api/events/${selectedEvent}/photos`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`
          },

          body: formData
        }
      );

      const data = await response.json();


      if (!response.ok) {

        alert(data.message);

        return;

      }


      alert("Photo uploaded successfully 🎉");

      setSelectedPhoto(null);


      // Refresh photos
      fetchPhotos(selectedEvent);


    } catch (error) {

      console.error(error);

      alert("Something went wrong");

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
          onChange={(e) =>
            setSelectedPhoto(e.target.files[0])
          }
          style={{
            display: "block",
            marginTop: "10px"
          }}
        />


        <button
          type="submit"
          style={{
            marginTop: "15px",
            padding: "12px 25px",
            cursor: "pointer"
          }}
        >
          📤 Upload Photo
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

            <div key={photo.id}>

              <img
                src={photo.storage_url}
                alt={photo.filename}
                style={{
                  width: "200px",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "10px"
                }}
              />

              <p>{photo.filename}</p>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}

export default Photos;