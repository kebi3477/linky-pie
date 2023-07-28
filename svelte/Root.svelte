<script>
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing/src/history";
    import Fetch from "./Module/fetch";

    async function isLogin() {
        const res = await Fetch.get('/api/users');
        return res.statusCode === 401 ? false : true;            
    }

    onMount(async () => {
        if (await isLogin()) {
            navigate("/block", { replace: true });
        } else {
            navigate("/login", { replace: true });
        }
    })
</script>