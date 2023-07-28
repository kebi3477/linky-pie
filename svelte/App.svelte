<script>
    import { Router, Link, Route } from "svelte-routing";
    import Login from './Login/Login.svelte';
    import Join from './Login/Join.svelte';
    import Block from './Block/Block.svelte';

    export let url = "/";
</script>

<main name="web-collector">
    <Router {url}>
        <Route path="block" component={Block}></Route>
        <Route path="join" component={Join}></Route>
        <Route path="/" component={Login}></Route>
    </Router>
</main>

<style>
    :global(*) {
        margin: 0;
        padding: 0;
        color: #333;
        box-sizing: border-box;
    }
    :global(input[type=text]),
    :global(input[type=password]) {
        border: none;
        padding: 5px 10px;
        border-radius: 0.25rem;
    }
    :global(button) {
        border: none;
    }
</style>
