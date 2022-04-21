import dynamic from "next/dynamic";

const MainApp = dynamic(
    () => import('../components/MainApp'),
    {ssr: false}
)

const IndexPage = () => (
    <MainApp/>
)

export default IndexPage
