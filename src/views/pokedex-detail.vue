<template>
  <div class="pokedex-detail">
    <loading v-model:active="loading" :is-full-page="fullPage" />
    <div class="container">
      <div class="columns is-mobile is-multiline">
        <div class="column">
          <div class="poke-header">
            <i class="mdi mdi-24px mdi-arrow-left" @click="clickBack()"></i>
            <h1>{{ capitalizer(this.$route.query.name) }}</h1>
          </div>
          <div class="detail-holder">
            <img
              :src="pokemon.sprites.other['official-artwork'].front_default"
            />
          </div>
        </div>
        <div class="column detail-tabs is-full">
          <div class="tabs is-centered">
            <ul>
              <li
                :class="tabActive === 0 ? 'is-active' : ''"
                @click="changeTabs(0)"
              >
                <a>Description</a>
              </li>
              <li
                :class="tabActive === 1 ? 'is-active' : ''"
                @click="changeTabs(1)"
              >
                <a>About</a>
              </li>
              <li
                :class="tabActive === 2 ? 'is-active' : ''"
                @click="changeTabs(2)"
              >
                <a>Base Stats</a>
              </li>
              <li
                :class="tabActive === 3 ? 'is-active' : ''"
                @click="changeTabs(3)"
              >
                <a>Moves</a>
              </li>
            </ul>
          </div>
          <div v-if="tabActive === 0" class="tabContent">
            <div class="columns is-mobile is-multiline">
              <template v-for="(text, j) in flavorText" :key="j">
                <div class="column is-one-third">{{ text.version }}</div>
                <div class="column is-two-thirds">
                  {{ text.text }}
                </div>
              </template>
            </div>
          </div>
          <div v-if="tabActive === 1" class="tabContent">
            <div class="columns is-mobile is-multiline">
              <div class="column is-one-third">Index</div>
              <div class="column is-two-thirds">#{{ pokemon.order }}</div>
              <div class="column is-one-third">Weight</div>
              <div class="column is-two-thirds">
                {{ (pokemon.weight / 10).toFixed(1) }} kg
              </div>
              <div class="column is-one-third">Height</div>
              <div class="column is-two-thirds">
                {{ (pokemon.height / 10).toFixed(1) }} m
              </div>
              <div class="column is-one-third">Ability</div>
              <div class="column is-two-thirds">
                {{ findAbility(pokemon.abilities) }}
              </div>
            </div>
          </div>
          <div v-if="tabActive === 2" class="tabContent">
            <div class="columns is-mobile is-multiline">
              <template v-for="(stat, j) in pokeStats" :key="j">
                <div class="column is-half">{{ stat.name }}</div>
                <div class="column is-half">
                  {{ stat.value }}
                </div>
              </template>
            </div>
          </div>
          <div v-if="tabActive === 3" class="tabContent">
            <div class="columns is-mobile is-multiline all-grey">
              <template v-for="(move, j) in moveList" :key="j">
                <div class="column is-half">{{ move.name }}</div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
export default {
  data() {
    return {
      loading: false,
      fullPage: false,
      tabActive: 0,
      pokemon: [],
      flavorText: [],
      pokeStats: [],
      moveList: [],
    };
  },
  components: {
    Loading,
  },
  created() {
    this.fetchPokemon();
  },
  methods: {
    changeTabs(active) {
      this.tabActive = active;
    },
    capitalizer(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    fetchPokemon() {
      this.loading = true;
      axios
        .get(`https://pokeapi.co/api/v2/pokemon/${this.$route.query.name}`)
        .then((res) => {
          this.pokemon = res.data;
          this.statFetch(res.data.stats);
          this.moveFetch(res.data.moves);
          axios
            .get(
              `https://pokeapi.co/api/v2/pokemon-species/${res.data.species.name}`
            )
            .then((resSpecies) => {
              this.pokemonSpecies = resSpecies.data;
              this.pokemonDescriptionFetch(resSpecies.data.flavor_text_entries);
              this.loading = false;
            });
        });
    },
    statFetch(data) {
      const statHolder = [];
      data.forEach((element) => {
        statHolder.push({
          name: this.capitalizer(element.stat.name).replace(/-/g, " "),
          value: element.base_stat,
        });
      });
      this.pokeStats = statHolder;
    },
    moveFetch(data) {
      const moveHolder = [];
      data.forEach((element) => {
        moveHolder.push({
          name: this.capitalizer(element.move.name).replace(/-/g, " "),
        });
      });
      this.moveList = moveHolder;
    },
    pokemonDescriptionFetch(data) {
      const longDesc = [];
      data.filter((item) => {
        if (item.language.name === "en") {
          longDesc.push(item);
        }
      });
      const filteredDesc = [];
      longDesc.forEach((element) => {
        filteredDesc.push({
          version: this.capitalizer(element.version.name).replace("\\f", " "),
          text: element.flavor_text.replace(/-/g, " "),
        });
      });
      this.flavorText = filteredDesc;
    },
    findAbility(abilities) {
      let abistring = "";
      abilities.forEach((element) => {
        abistring = abistring.concat(
          this.capitalizer(element.ability.name + ", ").replace(/-/g, " ")
        );
      });
      abistring = abistring.slice(0, -2);
      return abistring;
    },
    clickBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss">
.pokedex-detail {
  background: #000000;
  min-height: 100vh;
  padding-bottom: 30px;
  .poke-header {
    padding: 16px 16px 0;
    color: #ffffff;
  }
  .detail-holder {
    position: relative;
    display: flex;
    justify-content: center;
    img {
      margin-bottom: -69px;
      position: relative;
      z-index: 100;
    }
  }
  h1 {
    font-weight: bold;
    font-size: 24px;
    margin-top: 10px;
  }
  .detail-tabs {
    background: white;
    border-radius: 45px;
    padding-top: 30px;
    padding-bottom: 30px;
    .tabs {
      position: relative;
      z-index: 200;
    }
    .tabContent {
      font-weight: bold;
      padding: 0 16px;
      .all-grey {
        color: #666666;
      }
      .column {
        padding-top: 5px;
        padding-bottom: 5px;
        &:nth-child(odd) {
          color: #666666;
        }
      }
    }
  }
}
</style>
