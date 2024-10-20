<script setup lang="ts">
import { PropertyResponse } from '~/models/Property'
import { Stay } from '~/models/Stay'
import { useDate } from 'vuetify'


const date = useDate()
const route = useRoute()
const router = useRouter()
const { slug } = route.params
const id = Number(slug.toString().split('-').pop())

if (!id) {
  navigateTo('/')
}


const checkin = ref(route.query.checkin ? new Date(route.query.checkin.toString()) : new Date())
const checkout = ref(route.query.checkout ? new Date(route.query.checkout.toString()) : new Date())
const guestPerRoom = ref(route.query.guest_per_room || '1')
const numberOfRooms = ref(route.query.number_of_room || '1')
const loading = ref(false)
const showOverlay = ref(false)


let { data } = await useFetch<PropertyResponse>('/api/property', {
  query: {
    id,
    include: 'room'
  }
})

let { data: dataStay } = await useFetch<Stay>('/api/stay', {
  query: {
    property_id: id,
    checkin: route.query.checkin,
    checkout: route.query.checkout,
    guest_per_room: route.query.guest_per_room,
    number_of_room: route.query.number_of_room
  }
})

const dateFormatter = (dateParam: Date) => {
  const year = date.getYear(dateParam).toString()
  const month = (date.getMonth(dateParam) + 1).toString().padStart(2, '0')
  const numberDate  = date.getDate(dateParam).toString().padStart(2, '0')
  return year + '-' + month + '-' + numberDate
}

const handleSearch = async () => {
  router.push({
    query: {
      ...route.query,
      checkin: dateFormatter(checkin.value),
      checkout: dateFormatter(checkout.value),
      guest_per_room: guestPerRoom.value,
      number_of_room: numberOfRooms.value
    }
  })
  showOverlay.value = false
  loading.value = true
  // Refetch property data
  const { data: newData } = await useFetch<PropertyResponse>('/api/property', {
    query: {
      id,
      include: 'room'
    }
  })
  data.value = newData.value

  // Refetch stay data
  const { data: newDataStay } = await useFetch<Stay>('/api/stay', {
    query: {
      property_id: id,
      checkin: route.query.checkin,
      checkout: route.query.checkout,
      guest_per_room: route.query.guest_per_room,
      number_of_room: route.query.number_of_room
    }
  })
  dataStay.value = newDataStay.value
  loading.value = false
}


const groupedOffers = computed(() => {
  if (!dataStay.value) return {}
  return dataStay.value.offer_list.reduce((acc, offer) => {
    const groupKey = `${offer.room_name} - ${offer.room_data.id}`
    if (!acc[groupKey]) {
      acc[groupKey] = []
    }
    acc[groupKey].push(offer)
    return acc
  }, {})
})

const tab = ref('one')
const items = ref([
          {
            src: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
          },
          {
            src: 'https://cdn.vuetifyjs.com/images/carousel/sky.jpg',
          },
          {
            src: 'https://cdn.vuetifyjs.com/images/carousel/bird.jpg',
          },
        ])
const locationItems = ['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']
const handleButtonClickSearch = () => {
  console.log('clicked button search')
  showOverlay = !showOverlay
}
</script>

<template>
  <v-app-bar :elevation="0">
    <div class="d-flex justify-space-between align-center" style="width: 55%;margin-left: 22%;">
      <v-sheet class="ma-2 pa-2">
        <img src="https://project-exterior-technical-test-app.up.railway.app/img/logo.png" alt="Logo" class="logo"></img>
      </v-sheet>
      <v-sheet class="ma-2 pa-2"> 
        <v-btn color="grey-lighten-3" variant="flat" class="text-capitalize">
          <strong v-if="data" @click="handleButtonClickSearch">
            <span class="mdi mdi-magnify"></span>
            {{ data[id].name }}
            ·
            {{ route.query.checkin }}
            -
            {{ route.query.checkout }}
          </strong>
          <v-overlay
            v-model="showOverlay"
            activator="parent"
            location-strategy="connected"
            scroll-strategy="block"
            class="text-center align-center"
          >
            <v-card class="ma-2 pa-10" width="800">
              <!-- <v-combobox
                label="Where are you going?"
                :items="locationItems"
              ></v-combobox> -->
              <v-row>
                <v-col cols="6">
                  <v-date-picker title="Checkin" v-model="checkin"></v-date-picker>
                </v-col>
                <v-col cols="6">
                  <v-date-picker title="Checkout" v-model="checkout"></v-date-picker>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="guestPerRoom"
                    label="Number of Guests"
                    type="number"
                    min="1"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="numberOfRooms"
                    label="Number of Rooms"
                    type="number"
                    min="1"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-btn color="primary" variant="flat" block class="mt-4" @click="handleSearch">
                <span class="mdi mdi-magnify"></span>
                Search
              </v-btn>
            </v-card>
          </v-overlay>
        </v-btn>
      </v-sheet>
      <v-sheet class="ma-2 pa-2">
        <v-btn color="primary" variant="flat" class="text-capitalize">Sign In</v-btn>
      </v-sheet>
    </div>
  </v-app-bar>
  <v-main style="width: 55%;margin-left: 22%;">
    <div v-if="data" class="profile">
      <div class="d-flex justify-between">
        <v-sheet class="ma-2 pa-2">
          <NuxtImg :src="data[id].catalog.hero_image_url.sm" class="circle-image" />
        </v-sheet>
        <v-sheet class="ma-2 pa-2"> 
          <div class="name-rating">
            <h1 class="profile-name">{{ data[id].name }}</h1>
            <div class="star-rating">
              <span class="mdi mdi-star" style="color: gold; font-size: large;" v-for="a in data[id].catalog.star_rating"></span>
            </div>
          </div>
          <p class="profile-type">{{ data[id].type }}</p>
          <p class="profile-address">{{ data[id].address_line }}, {{ data[id].name_suffix }}, {{ data[id].catalog.postal_code }}</p>
          <div class="profile-stats">
            <div class="stat">
              <v-progress-circular :model-value="data[id].catalog.review_rating" color="purple">{{ data[id].catalog.review_rating }}</v-progress-circular>
              <span class="stat-label">Excellent - </span>
              <span class="stat-label">{{ data[id].catalog.review_count }}</span>
              <span class="stat-label">Reviews</span>
            </div>
          </div>
        </v-sheet>
      </div>
    </div>
    
    
    <!-- <div v-for="(r, idx) in data[id].room" :key="idx">
      <pre>id: {{ idx }}</pre>
      <pre>name: {{ r.name }}</pre>
      <pre>descriptions: {{ r.descriptions }}</pre>
      <pre>images: {{ r.images }}</pre>
      <pre>amenities: {{ r.amenities }}</pre>
    </div> -->
    <v-card>
      <v-divider></v-divider>
      <v-tabs
        v-model="tab"
        color="blue"
        align-tabs="center"
      >
        <v-tab value="one">
          <div class="row">
            <v-icon icon="mdi-tag-outline"></v-icon>
            DEALS
          </div>
        </v-tab>
        <v-tab value="two">
          <div class="row">
            <v-icon icon="mdi-grid"></v-icon>
            PHOTOS
          </div>
        </v-tab>
        <v-tab value="three">
          <div class="row">
            <v-icon icon="mdi-information-outline"></v-icon>
            INFO
          </div>
        </v-tab>
      </v-tabs>

      <v-card-text>
        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="one">
            <div v-if="loading">
              <v-skeleton-loader type="card"></v-skeleton-loader>
            </div>
            <div v-else>
              <div v-if="dataStay">
                <div v-for="(offers, groupKey) in groupedOffers" :key="groupKey">
                  <v-card
                    class="mx-auto"
                    width="700"
                  >
                    <template v-slot:title>
                      <div class="d-flex justify-space-between align-center">
                        <v-sheet class="ma-2 pa-2">
                          <h5>{{ groupKey.split('-')[0] }}</h5>
                          <div class="d-flex justify-between align-left" style="font-size: small;">
                            <v-sheet class="ma-1 pa-1">
                              <span class="mdi mdi-bed-double-outline"></span>
                              {{ offers[0].room_bed_groups }} 
                            </v-sheet>
                            <v-sheet class="ma-1 pa-1">
                              <span class="mdi mdi-shape-square-plus"></span>
                              {{ offers[0].room_size_sqm }} m²
                            </v-sheet>
                          </div>
                        </v-sheet>
                        <v-sheet class="ma-2 pa-2"> 
                          <v-btn class="text-capitalize" variant="flat"><span style="color:blue;">See Details</span></v-btn>
                        </v-sheet>
                      </div>
                    </template>
                    <div v-for="offer in offers" :key="offer.offer_id">
                      <v-divider></v-divider>
                      <div class="d-flex justify-space-between align-center">
                        <v-sheet class="ma-2 pa-2">
                            <span :style="{ color: offer.xcode_log.amenities['1073742786'] ? 'green' : 'grey' }">
                              <span class="mdi mdi-silverware-fork-knife"></span>
                              {{ offer.xcode_log.amenities['1073742786'] ? 'Free Breakfast' : 'Without Breakfast' }}
                            </span>
                            <br>
                            <!-- <h3>{{ offer.room_data.id }}</h3> -->
                            <span :style="{ color: offer.xcode_log.refundable ? 'green' : 'red' }">
                              <span :class="['mdi', offer.xcode_log.refundable ? 'mdi-credit-card-outline' : 'mdi-credit-card-off-outline']"></span>
                              {{ offer.xcode_log.refundable ? offer.cancel_policy_description : 'Non-refundable' }}
                            </span>
                            <!-- <p>Cancel Policy: {{ offer.cancel_policy_code }} - {{ offer.cancel_policy_deadline }} - {{ offer.cancel_policy_description }}</p> -->
                            <!-- <p>Amenities: {{ offer.xcode_log.amenities }}</p> -->
                            <p>Rp: <strong style="font-size: medium;">{{ offer.rate_nightly.toLocaleString() }}</strong> /night *</p>
                            <span class="text-grey" v-if="offer.rate_nightly != offer.price_total">Total - Rp: {{ offer.price_total.toLocaleString() }}</span>
                            <br>
                            <span class="text-grey">after tax & fees</span>
                        </v-sheet>
                        <v-sheet class="ma-2 pa-2"> 
                          <v-btn color="primary" class="text-capitalize">Book Now</v-btn>
                        </v-sheet>
                      </div>
                      <div class="d-flex justify-space-between align-center">
                        <v-sheet class="ma-2 pa-2 text-grey">
                          <span>Member-only price, valid in app only</span>
                        </v-sheet>
                        <v-sheet class="ma-2 pa-2 text-blue"> 
                          <span class="mdi mdi-star"></span>
                          <span>Collect {{ offer.pricing_data.wisata_point }} points</span>
                        </v-sheet>
                      </div>
                    </div>
                    
                  </v-card>
                  <br>
                </div>
              </div>
            </div>
            
          </v-tabs-window-item>

          <v-tabs-window-item value="two">
            <v-container class="">
              <v-row no-gutters>
                <v-col
                  v-for="(item,i) in items"
                  cols="12"
                  sm="4"
                >
                  <v-sheet class="ma-2 pa-2">
                    <NuxtImg :src="item.src"/>
                  </v-sheet>
                </v-col>
              </v-row>
              <v-carousel hide-delimiters>
                <v-carousel-item
                  v-for="(item,i) in items"
                  :key="i"
                  :src="item.src"
                  cover
                ></v-carousel-item>
              </v-carousel>
            </v-container>
          </v-tabs-window-item>

          <v-tabs-window-item value="three">
            <h3>About the property</h3>
            <p>
              Fairmont Jakarta is centrally located in Jakarta, a 3-minute walk from Plaza Senayan and 13 minutes by foot from Gelora Bung Karno Stadium. This luxury hotel is 1.6 mi (2.6 km) from Blok M Square and 3.8 mi (6.2 km) from Grand Indonesia.
              <br>Enjoy international cuisine at Spectrum, one of the hotel's 10 restaurants, or stay in and take advantage of the 24-hour room service. Snacks are also available at the coffee shop/cafe. Relax with a refreshing drink from the poolside bar or one of the 4 bars/lounges. Buffet breakfasts are available daily for a fee.
              <br>Relax at the full-service spa, where you can enjoy massages, body treatments, and facials. You can take advantage of recreational amenities such as a health club, an outdoor pool, and a spa tub. Additional features at this hotel include complimentary wireless internet access, concierge services, and gift shops/newsstands.
            </p>
            <br>
            <h3>Language</h3>
            <p>English, Indonesian, Japanese, Chinese (Mandarin).</p>
            <br>
            <h3>Policies</h3>
            <div class="d-flex justify-between">
              <v-sheet class="pa-1">
                <h4>Check-in</h4>
                <p>2:00 PM</p>
              </v-sheet>
              <v-sheet class="pa-1"> 
                <h4>Check-out</h4>
                <p>12:00 PM</p>
              </v-sheet>
            </div>
            <br>
            <h3>Additional check-in information</h3>
            <ul>
              <li>Extra-person charges may apply and vary depending on property policy</li>
              <li>Government-issued photo identification and a credit card, debit card, or cash deposit may be required at check-in for incidental charges</li>
              <li>Special requests are subject to availability upon check-in and may incur additional charges; special requests cannot be guaranteed</li>
              <li>This property accepts credit cards, debit cards, and cash</li>
              <li>This property uses a grey water recycling system</li>
              <li>Safety features at this property include a fire extinguisher, a security system, a first aid kit, and window guards </li>
              <li>This property affirms that it follows the cleaning and disinfection practices of ALLSAFE (Accor Hotels)</li>
            </ul>
            <br>
            <h3>Others</h3>
            <ul>
              <li>Reservations are required for massage services and spa treatments. Reservations can be made by contacting the hotel prior to arrival, using the contact information on the booking confirmation.</li>
              <li>No pets and no service animals are allowed at this property.</li>
            </ul>
            <br>
            <h2>Important information</h2>
            <br>
            <h3>Optional charges</h3>
            <ul>
              <li>Fee for buffet breakfast: approximately USD 21 for adults and USD 10.5 for children</li>
              <li>Airport shuttle fee: USD 30 per vehicle (roundtrip)</li>
              <li>Valet parking fee: USD 20 per day</li>
            </ul>
            <br>
            <p>The above list may not be comprehensive. Fees and deposits may not include tax and are subject to change.</p>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
    </v-card>
  </v-main>
</template>

<style scoped>

ul {
  list-style-type: disc;
  padding-left: 20px;
}

.profile {
  max-width: 935px;
  margin: 0 auto;
  padding: 30px 20px;
}

.profile-header {
  display: flex;
  align-items: center;
}

.circle-image {
  border-radius: 50%;
  width: 150px;
  height: 150px;
  object-fit: cover;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 28px;
  font-weight: 300;
  margin-bottom: 10px;
}

.profile-type {
  text-transform: capitalize;
  font-size: 16px;
  color: #8e8e8e;
  margin-bottom: 5px;
}

.profile-address {
  font-size: 16px;
  color: #000000;
  margin-bottom: 5px;
}

.profile-stats {
  display: flex;
  margin-top: 20px;
}

.stat {
  margin-right: 40px;
}

.stat-value {
  font-weight: 600;
  font-size: 18px;
}

.stat-label {
  color: #000000;
  font-size: 14px;
  margin-left: 5px;
}

.name-rating {
  display: flex;
  align-items: center;
}

.star-rating {
  display: flex;
  align-items: center;
  margin-left: 10px;
  margin-bottom: 10px;
}

</style>