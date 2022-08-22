<template>
  <div class="pokedex-home">
    <loading v-model:active="loading" :is-full-page="fullPage" />
    <div class="container">
      <button class="favButton" @click="modalOpen()">
        <img alt="pokedex" src="../assets/pokedex.png" />
      </button>
      <div class="poke-header">
        <img alt="pokemon" src="../assets/pokemon.png" />
        <div class="select">
          <select v-model="typeValue">
            <option
              v-for="(type, l) in pokemonTypes"
              :key="l"
              :value="type.value"
            >
              {{ type.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="columns is-multiline is-mobile">
        <pokemon
          v-for="(pokemon, i) in pokemonList"
          :key="i"
          :pokemon="pokemon.name"
          @poke-fav="favoritePokemon"
        />
      </div>
    </div>
    <div class="modal" :class="modalActive ? 'is-active' : ''">
      <div class="modal-background" @click="modalClose()"></div>
      <div class="modal-card">
        <section class="modal-card-body">
          <div class="modal-header">
            <p class="modal-card-title">Favorite pokemon list</p>
            <span class="mdi mdi-close close" @click="modalClose()"></span>
          </div>
          <div class="columns is-mobile is-multiline">
            <div v-if="ichooseyou.length === 0" class="column empty">
              Please select your favorite pokemon!
            </div>
            <div
              v-else
              v-for="(fav, k) in ichooseyou"
              :key="k"
              class="column modal-section-parent is-half-tablet is-full-mobile"
            >
              <span
                class="mdi mdi-close close"
                @click="removeFavorite(fav.name)"
              ></span>
              <div
                class="modal-section"
                :class="fav.type"
                @click="pokeDetailsPage(fav.name)"
              >
                <div class="image">
                  <img :src="fav.image" />
                </div>
                <div class="content ml-4">
                  {{ capitalizer(fav.name) }}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import Pokemon from "@/components/pokemon-section.vue";

export default {
  data() {
    return {
      pokemonList: [],
      typeValue: "all",
      loading: false,
      fullPage: true,
      scrolled: false,
      ichooseyou: [],
      modalActive: false,
      pokemonTypes: [
        {
          value: "all",
          name: "All types",
        },
        {
          value: "normal",
          name: "Normal",
        },
        {
          value: "fire",
          name: "Fire",
        },
        {
          value: "water",
          name: "Water",
        },
        {
          value: "grass",
          name: "Grass",
        },
        {
          value: "electric",
          name: "Electric",
        },
        {
          value: "ice",
          name: "Ice",
        },
        {
          value: "fighting",
          name: "Fighting",
        },
        {
          value: "poison",
          name: "Poison",
        },
        {
          value: "ground",
          name: "Ground",
        },
        {
          value: "flying",
          name: "Flying",
        },
        {
          value: "psychic",
          name: "Psychic",
        },
        {
          value: "bug",
          name: "Bug",
        },
        {
          value: "rock",
          name: "Rock",
        },
        {
          value: "ghost",
          name: "Ghost",
        },
        {
          value: "dark",
          name: "Dark",
        },
        {
          value: "dragon",
          name: "Dragon",
        },
        {
          value: "steel",
          name: "Steel",
        },
        {
          value: "fairy",
          name: "Fairy",
        },
      ],
      selectedType: null,
    };
  },
  components: {
    Pokemon,
    Loading,
  },
  created() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.fetchPokemon(0, true);
  },
  mounted() {
    window.addEventListener("scroll", this.onPageScroll);
    if (localStorage.getItem("ichooseyou") !== null) {
      this.ichooseyou = JSON.parse(localStorage.getItem("ichooseyou"));
    }
  },
  unmounted() {
    window.removeEventListener("scroll", this.onPageScroll);
  },
  watch: {
    typeValue(value) {
      this.typeChange(value);
    },
  },
  methods: {
    typeChange(type) {
      if (type === "all") {
        this.selectedType = null;
      } else {
        this.selectedType = type;
      }
      this.fetchPokemon(0, true, this.selectedType);
    },
    capitalizer(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    modalOpen() {
      this.modalActive = true;
      document.body.style.overflowY = "hidden";
      document.getElementsByTagName("html")[0].style.overflowY = "hidden";
      document.body.style.height = "100%";
    },
    modalClose() {
      this.modalActive = false;
      document.body.style.overflowY = "auto";
      document.getElementsByTagName("html")[0].style.overflowY = "auto";
      document.body.style.height = "auto";
    },
    favoritePokemon(data) {
      let counter = 0;
      this.ichooseyou.forEach((element) => {
        if (element.name === data.name) {
          counter++;
        }
      });
      if (counter < 1) {
        this.ichooseyou.push(data);
      }
      localStorage.setItem("ichooseyou", JSON.stringify(this.ichooseyou));
    },
    fetchPokemon(offset, reset, type) {
      this.loading = true;
      let url = "";
      if (type) {
        url = `https://pokeapi.co/api/v2/type/${type}`;
      } else {
        url = "https://pokeapi.co/api/v2/pokemon";
      }
      if (reset) {
        this.pokemonList = [];
      }
      axios.get(`${url}?limit=12&offset=${offset}`).then((res) => {
        if (type) {
          this.mapPokemonTyped(res.data.pokemon, reset);
        } else {
          this.mapPokemon(res.data.results, reset);
        }
      });
    },
    mapPokemonTyped(data, reset) {
      let pokeList = [];
      if (reset) {
        pokeList = [];
      } else {
        pokeList = this.pokemonList;
      }
      data.forEach((element) => {
        pokeList.push({
          name: element.pokemon.name,
        });
      });
      this.pokemonList = pokeList;
      this.loading = false;
      this.scrolled = false;
    },
    mapPokemon(data, reset) {
      let pokeList = [];
      if (reset) {
        pokeList = [];
      } else {
        pokeList = this.pokemonList;
      }
      data.forEach((element) => {
        pokeList.push({
          name: element.name,
        });
      });
      this.pokemonList = pokeList;
      this.loading = false;
      this.scrolled = false;
    },
    pokeDetail(name) {
      axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`).then((res) => {
        return res;
      });
    },
    pokeDetailsPage(name) {
      const query = {
        name,
      };
      this.$router.push({
        path: `/detail/`,
        query,
      });
    },
    removeFavorite(name) {
      this.ichooseyou = this.ichooseyou.filter(function (obj) {
        return obj.name !== name;
      });
      localStorage.setItem("ichooseyou", JSON.stringify(this.ichooseyou));
    },
    onPageScroll() {
      // handle lazyload
      if (
        window.innerHeight + window.pageYOffset >=
        document.body.offsetHeight - 40
      ) {
        if (!this.scrolled) {
          this.scrolled = true;
          if (this.selectedType === null) {
            this.fetchPokemon(this.pokemonList.length);
          }
        }
      }
    },
  },
};
</script>

<style lang="scss">
.pokedex-home {
  .container {
    position: relative;
  }
  padding: 16px;
  position: relative;
  .poke-header {
    padding: 16px 0;
    display: flex;
    justify-content: space-between;
    img {
      width: 100px;
      height: auto;
    }
  }
  .favButton {
    position: fixed;
    right: 16px;
    bottom: 16px;
    z-index: 40;
    width: 60px;
    height: 60px;
    background: red;
    cursor: pointer;
  }
  .empty {
    margin-top: 20px;
    font-weight: bold;
    font-size: 18px;
  }
  .modal-header {
    display: flex;
    align-content: center;
    margin-bottom: 16px;
    span {
      font-size: 20px;
    }
  }
  .modal-section-parent {
    position: relative;
    .close {
      color: #ffffff;
      position: absolute;
      top: 21px;
      right: 26px;
      z-index: 40;
      font-size: 20px;
      cursor: pointer;
    }
    .modal-section {
      display: flex;
      background: #8f8e8e;
      color: #ffffff;
      font-weight: bold;
      border-radius: 4px;
      padding: 16px;
      position: relative;
      cursor: pointer;
      &.normal {
        background: #a8a77a;
      }
      &.fire {
        background: #ee8130;
      }
      &.water {
        background: #6390f0;
      }
      &.electric {
        background: #f7d02c;
      }
      &.grass {
        background: #7ac74c;
      }
      &.ice {
        background: #96d9d6;
      }
      &.fighting {
        background: #c22e28;
      }
      &.poison {
        background: #a33ea1;
      }
      &.ground {
        background: #e2bf65;
      }
      &.flying {
        background: #a98ff3;
      }
      &.psychic {
        background: #f95587;
      }
      &.bug {
        background: #a6b91a;
      }
      &.rock {
        background: #b6a136;
      }
      &.ghost {
        background: #735797;
      }
      &.dragon {
        background: #6f35fc;
      }
      &.dark {
        background: #705746;
      }
      &.steel {
        background: #b7b7ce;
      }
      &.fairy {
        background: #d685ad;
      }
      .image {
        width: 60px;
        height: 60px;
      }
      .content {
        display: flex;
        align-items: center;
        margin-bottom: 0;
      }
    }
  }
}
</style>
