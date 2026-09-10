import { useEffect, useState } from "react";

function Galleries() {

  const [events, setEvents] = useState([]);

  const [selectedEvent, setSelectedEvent] = useState("");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [pin, setPin] = useState("");

  const [photos, setPhotos] = useState([]);

  const [galleryId, setGalleryId] = useState(null);

  const [createdGallery, setCreatedGallery] = useState(null);


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


  // GET PHOTOS FOR SELECTED EVENT
  const fetchPhotos = async (eventId) => {

    if (!eventId) {

      setPhotos([]);

      return;

    }

    try {

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

    }

  };


  // SELECT EVENT
  const handleEventChange = (eventId) => {

    setSelectedEvent(eventId);

    fetchPhotos(eventId);

  };


  // CREATE GALLERY
  const handleCreateGallery = async (e) => {

    e.preventDefault();


    if (!selectedEvent) {

      alert("Please select an event");

      return;

    }


    try {

      const token = localStorage.getItem("token");

      const response = await fetch(

        `http://localhost:3000/api/events/${selectedEvent}/galleries`,

        {
          method: "POST",

          headers: {

            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`

          },

          body: JSON.stringify({

            title,
            slug,
            pin

          })

        }

      );


      const data = await response.json();


      if (!response.ok) {

        alert(data.message);

        return;

      }


      alert("Gallery created successfully 🎉");


      // Save gallery details
      setGalleryId(data.galleryId);

      setCreatedGallery({
        id: data.galleryId,
        slug: data.slug,
        title: title
      });


      // Clear form
      setTitle("");
      setSlug("");
      setPin("");


    } catch (error) {

      console.error(error);

      alert("Something went wrong");

    }

  };


  // ADD PHOTO TO GALLERY
  const handleAddPhoto = async (photoId) => {

    if (!galleryId) {

      alert("Please create a gallery first");

      return;

    }

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(

        `http://localhost:3000/api/galleries/${galleryId}/photos`,

        {
          method: "POST",

          headers: {

            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`

          },

          body: JSON.stringify({

            photo_id: photoId

          })

        }

      );


      const data = await response.json();


      if (!response.ok) {

        alert(data.message);

        return;

      }


      alert("Photo added to gallery 📸🎉");


    } catch (error) {

      console.error(error);

      alert("Something went wrong");

    }

  };


  // PUBLISH GALLERY
  const handlePublishGallery = async () => {

    if (!galleryId) {

      alert("Please create a gallery first");

      return;

    }

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(

        `http://localhost:3000/api/galleries/${galleryId}/publish`,

        {
          method: "PATCH",

          headers: {

            Authorization: `Bearer ${token}`

          }

        }

      );


      const data = await response.json();


      if (!response.ok) {

        alert(data.message);

        return;

      }


      alert(
        `Gallery published successfully 🎉
        
Shareable Link:
http://localhost:5173${data.shareableLink}`
      );


    } catch (error) {

      console.error(error);

      alert("Something went wrong");

    }

  };


  return (

    <div style={{ padding: "40px" }}>

      <h1>🖼️ Galleries Management</h1>

      <p>Create secure photo galleries for your customers.</p>


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


      {/* CREATE GALLERY */}

      <form

        onSubmit={handleCreateGallery}

        style={{

          marginTop: "30px",

          background: "white",

          padding: "25px",

          borderRadius: "10px",

          maxWidth: "500px"

        }}

      >

        <h2>Create Gallery</h2>


        <input

          type="text"

          placeholder="Gallery Title"

          value={title}

          onChange={(e) => setTitle(e.target.value)}

          required

          style={{

            display: "block",

            width: "100%",

            padding: "12px",

            marginTop: "15px"

          }}

        />


        <input

          type="text"

          placeholder="Gallery Slug"

          value={slug}

          onChange={(e) => setSlug(e.target.value)}

          required

          style={{

            display: "block",

            width: "100%",

            padding: "12px",

            marginTop: "15px"

          }}

        />


        <input

          type="password"

          placeholder="Gallery PIN"

          value={pin}

          onChange={(e) => setPin(e.target.value)}

          required

          style={{

            display: "block",

            width: "100%",

            padding: "12px",

            marginTop: "15px"

          }}

        />


        <button
          type="submit"
          style={{

            marginTop: "20px",

            padding: "12px 25px"

          }}
        >

          ➕ Create Gallery

        </button>

      </form>


      {/* PHOTOS */}

      <hr style={{ margin: "40px 0" }} />

      <h2>📸 Event Photos</h2>


      {!selectedEvent ? (

        <p>Select an event to view photos.</p>

      ) : photos.length === 0 ? (

        <p>No photos found for this event.</p>

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

                background: "white",

                padding: "10px",

                borderRadius: "10px"

              }}

            >

              <img

                src={photo.storage_url}

                alt={photo.filename}

                style={{

                  width: "180px",

                  height: "180px",

                  objectFit: "cover",

                  borderRadius: "8px"

                }}

              />


              <p>{photo.filename}</p>


              <button

                onClick={() =>
                  handleAddPhoto(photo.id)
                }

              >

                ➕ Add to Gallery

              </button>

            </div>

          ))}

        </div>

      )}


      {/* PUBLISH */}

      {createdGallery && (

        <div

          style={{

            marginTop: "40px",

            padding: "20px",

            background: "#eee",

            maxWidth: "500px"

          }}

        >

          <h2>🚀 Ready to Publish</h2>

          <p>

            Gallery: {createdGallery.title}

          </p>


          <button

            onClick={handlePublishGallery}

            style={{

              padding: "12px 25px",

              cursor: "pointer"

            }}

          >

            🚀 Publish Gallery

          </button>

        </div>

      )}

    </div>

  );

}

export default Galleries;