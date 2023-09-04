<script>
    import { navigate } from "svelte-routing/src/history";
    import logo from '../public/images/logo_b.svg';

    function redirect(url) {
        navigate(`/${url}`, { replace: true });
    }
</script>


<div class="header">
    <button on:click={() => redirect('my-page')}>
        <img src="{logo}" alt="logo">
    </button>
</div>

<style>
    .header {
        width: 100%;
        height: 76px;
        background-color: #fff;
        padding: 23px 70px;
    }
    
</style>