<script>
    import { Link, link } from "svelte-routing";
</script>
<header class="main__header">
    <a href="/block" class="main__button" use:link>block</a>
    <a href="/group" class="main__button" use:link>gorup</a>
</header>
<style>
    .main__header {
        width: 100%;
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-end;
        align-items: flex-end;
        gap: 10px;
        padding: 10px;
        position: absolute;
        top: 0;
    }
    .main__button {
        transition: .5s;
        color: #ddd;
        cursor: pointer;
    }
    .main__button:hover {
        color: #fff;
    }
</style>