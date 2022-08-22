<template>
  <div class="column is-one-third-tablet is-half-mobile pokemon">
    <div class="poke-details-section">
      <img
        alt="catch"
        class="catch"
        @click="favoritePoke(pokemon, pokeImage)"
        src="../assets/pokeball.png"
      />
      <div class="pokemon-section" @click="pokeDetails()">
        <div class="illustration"><img :src="pokeImage" /></div>
        <div class="name">{{ capitalizer(pokemon) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: {
    pokemon: String,
  },
  data() {
    return {
      detail: [],
      pokeImage: "",
    };
  },
  created() {
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${this.pokemon}`)
      .then((res) => {
        this.pokeImage =
          res.data.sprites.other["official-artwork"].front_default;
      });
  },
  methods: {
    capitalizer(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    pokeDetails() {
      const query = {
        name: this.pokemon,
      };
      this.$router.push({
        path: `/detail/`,
        query,
      });
    },
    favoritePoke(name, image) {
      const pokemonData = { name, image };
      this.$emit("poke-fav", pokemonData);
    },
  },
};
</script>

<style lang="scss">
.pokemon {
  .container {
    padding: 0 16px;
  }
  .poke-details-section {
    position: relative;
    .catch {
      position: absolute;
      width: 30px;
      height: 30px;
      top: 5px;
      right: 10px;
      cursor: pointer;
    }
  }
  .pokemon-section {
    padding: 40px 16px 16px;
    background: #000000;
    cursor: pointer;
    .illustration {
      background: #ffffff;
    }
    .name {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 16px;
      color: #ffffff;
      font-size: 20px;
      font-weight: bold;
    }
  }
  .fire {
    background: #ee8130;
  }
}
</style>
