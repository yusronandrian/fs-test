  <template>
    <div class="container">
      <h1 class="title">Welcome to the Home Page</h1>
      <button @click="redirectToHotel" class="book-button">Book Fairmont Jakarta</button>
    </div>
  </template>

  <script>
  export default {
    methods: {
      redirectToHotel() {
        this.$router.push('/stay/fairmont-jakarta-9000248394?checkin=2025-03-04&checkout=2025-03-08&guest_per_room=2&number_of_room=1');
      }
    }
  }
  </script>

  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
  }

  .title {
    font-size: 2.5rem;
    margin-bottom: 2rem;
    color: #333;
  }

  .book-button {
    padding: 1rem 2rem;
    font-size: 1.2rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .book-button:hover {
    background-color: #45a049;
  }
  </style>
