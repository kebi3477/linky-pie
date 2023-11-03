<script>
    import { onMount } from 'svelte';
    import { Router, Link, Route } from "svelte-routing";

    import Root from "./Root.svelte";
    import Intro from './routes/Intro.svelte';
    import Main from './routes/Main.svelte';
    import Mypage from './routes/MyPage.svelte';
    import Block from './routes/Block.svelte';
    import Detail from './routes/Detail.svelte';
    import Group from "./routes/Group.svelte";
    import Follow from './routes/Follow.svelte';
    import EditProfile from './routes/EditProfile.svelte';
    import User from './routes/User.svelte';

    import simbol from './public/images/simbol.svg';
    
    onMount(() => {
        document.documentElement.lang = 'ko';
    });
    
    export let projectURL = '';
    export let url = "/";
</script>

<svelte:head>
    <title>Linky Pie 🥧</title>
    <link rel="shortcut icon" href="{simbol}">
    <meta property="og:title" content="Linky Pie">
    <meta property="og:description" content="링크를 공유하다. 링키파이">
    <meta property="og:image" content="{projectURL}/public/images/simbol.png">
    <meta property="og:url" content="{projectURL}">
    <meta property="og:type" content="website">

    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="Linky Pie">
    <meta name="twitter:description" content="링크를 공유하다. 링키파이">
    <meta name="twitter:image" content="{projectURL}/public/images/simbol.png">
</svelte:head>
<main name="web-collector">
    <Router {url}>
        <Route path="/" component={Root}></Route>
        <Route path="/intro" component={Intro}></Route>
        <Route path="/main" component={Main}></Route>
        <Route path="/my-page" component={Mypage}></Route>
        <Route path="/group" component={Group}></Route>
        <Route path="/block" component={Block}></Route>
        <Route path="/follow" component={Follow}></Route>
        <Route path="/edit-profile" component={EditProfile}></Route>
        <Route path="/detail" component={Detail}></Route>
        <Route path="/detail/:block_id" component={Detail}></Route>
        <Route path="/user/:user_id" component={User}></Route>
    </Router>
</main>

<style>
    @font-face {
        font-family: 'Noto Sans KR';
        src: url('../NotoSans-Regular.woff2') format('woff2');
        font-weight: normal;
        font-style: normal;
    }
    @font-face {
        font-family: 'Ramche';
        src: url('../Ramche.ttf') format('woff2');
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
