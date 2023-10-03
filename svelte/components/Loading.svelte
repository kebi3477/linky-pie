<script>
    import loading from '../public/images/loading.svg';

    let isLoading = false;

    export function start() {
        isLoading = true;
    } 

    export function stop() {
        isLoading = false;
    }
</script>
<div class="popup__background" class:active={isLoading}>
    <div class="loading__body">
        <img src="{loading}" alt="loading">
    </div>
</div>
<style>
    .popup__background {
        width: 100%;
        min-height: 100vh;
        background-color: rgba(0, 0, 0, .5);
        position: fixed;
        display: none;
        align-items: center;
        justify-content: center;
    }
    .popup__background.active {
        display: flex;
    }
    .loading__body {
        width: 50px;
        height: 50px;
    }
    .loading__body > img {
        width: 100%;
    }
    
</style>