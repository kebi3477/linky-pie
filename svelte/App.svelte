<script>
    import { Router, Link, Route } from "svelte-routing";
    import notoSansKR from './public/fonts/NotoSans-Regular.woff2';

    import Root from "./Root.svelte";
    import Login from './routes/Login.svelte';
    import Join from './routes/Join.svelte';
    import Block from './routes/Block.svelte';
    import Group from "./routes/Group.svelte";
    import Intro from './routes/Intro.svelte';
    
    export let url = "/";
</script>

<main name="web-collector">
    <Router {url}>
        <Route path="block" component={Block}></Route>
        <Route path="group" component={Group}></Route>
        <Route path="join" component={Join}></Route>
        <Route path="login" component={Login}></Route>
        <Route path="intro" component={Intro}></Route>
        <Route path="/" component={Root}></Route>
    </Router>
</main>

<style>
    @font-face {
        font-family: 'Noto Sans KR';
        src: url('c9da3fade5b0bcb2.woff2') format('woff2');
        font-weight: normal;
        font-style: normal;
    }
    @font-face {
        font-family: 'Ramche';
        src: url('Ramche.ttf') format('woff2');
        font-weight: normal;
        font-style: normal;
    }

    :global(*) {
        margin: 0;
        padding: 0;
        color: #333;
        box-sizing: border-box;
        font-family: 'Noto Sans KR', sans-serif;
    }
    :global(input[type=text]),
    :global(input[type=password]) {
        border: none;
        padding: 5px 10px;
        border-radius: 0.25rem;
    }
    :global(button) {
        border: none;
        cursor: pointer;
        background-color: transparent;
    }
</style>
