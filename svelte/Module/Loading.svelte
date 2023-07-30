<script>
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
        <div class="loading__circle"></div>
    </div>
</div>
<style>
    .popup__background {
        width: 100%;
        height: 100vh;
        background-color: rgba(0, 0, 0, .5);
        position: absolute;
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
    .loading__circle {
        width: 100%;
        height: 100%;
        border-radius: 100%;
        border: 10px solid #fff;
        border-color: #fff #fff #fff transparent;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>