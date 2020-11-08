<template>
    <v-card class="ma-1" :class="cardClasses" width="70%">
        <v-card-text>
            <span :class="nameClasses">{{ number  }}  {{ hours }}: {{minutes}} {{ name }}</span>&mdash;{{ message }} 
        </v-card-text>
    </v-card>
</template>
<script>
export default {
    props: {
        name: String,
        color: String,
        message: String,
        hours: Number,
        minutes: Number,
        isSelf: Boolean,
        number: Number
    },
    computed: {
        nameClasses() {
            return [
                `${this.color}--text`,
                {
                'font-weight-bold': this.isSelf
                }
            ]
        },
        cardClasses() {
            return [
                'flex-shrink-1',
                'flex-grow-0',
                'd-flex-1',
                {
                    'align-self-end': this.isSelf
                }
            ]
        }
    },
}
</script>