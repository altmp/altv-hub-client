<template>
    <div class="navigation" ref="navbar">
        <a class="logo" href="https://altv.mp/" target="_blank">
            <img src="../assets/logo.svg" />
        </a>
        <input
            type="text"
            placeholder="Search for resources..."
            v-model="searchInput"
            @keydown="search"
        />
        <div class="buttons">
            <button :class="currentSort.by == 'stars' ? 'active' : ''" @click="sort('stars')">
                <svg
                    version="1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    enable-background="new 0 0 48 48"
                >
                    <rect 
                        v-for="(width, i) in arr = [6, 14, 22, 30, 38]"
                        :key="width" 
                        :y="currentSort.asc ? width : arr.reverse()[i]"
                        :width="width - 2" 
                        x="6" 
                        fill="#FFFFFF" 
                        height="4" 
                    />
                </svg>
                Stars
            </button>
            <button :class="currentSort.by == 'updated' ? 'active' : ''" @click="sort('updated')">
                <svg
                    version="1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    enable-background="new 0 0 48 48"
                >
                    <rect 
                        v-for="(width, i) in arr = [6, 14, 22, 30, 38]"
                        :key="width" 
                        :y="currentSort.asc ? width : arr.reverse()[i]"
                        :width="width - 2" 
                        x="6" 
                        fill="#FFFFFF" 
                        height="4" 
                    />
                </svg>
                Date
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Navigation',
    props: ['auth'],
    data() {
        return {
            searchInput: '',
            activePath: 'home',
            currentSort: {
                by: 'stars',
                asc: false
            }
        };
    },
    methods: {
        isActive(name) {
            return this.activePath === name ? { active: true } : {};
        },
        setLink(e) {
            const id = e.target.id;
            this.activePath = id;
        },
        search() {
            this.$root.$emit('search', this.searchInput);
        },
        sort(by) {
            if (this.currentSort.by == by) {
                this.currentSort.asc = !this.currentSort.asc;
            } else {
                this.currentSort.by = by;
            }

            this.$root.$emit('sort', this.currentSort);
        }
    },
    mounted() {
        this.$on('router:SetLink', linkName => {
            this.setLink({ id: linkName });
        });
    }
};
</script>
