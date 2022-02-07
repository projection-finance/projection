import Home from "./components/Home/home";
import MyProjections from "./components/projection/myProjections";
import Projection from "./components/projection/projection";
import { v4 as uuidv4 } from 'uuid';

const routes=[
    {
        path:'/',
        component:<Home/>,
        name:"Home",
        navBar:true
    },
    {
        path:'/myprojections',
        component:<MyProjections/>,
        name:"My projections",
        navBar:true
    },
    {
        path:'/projection/:projectionId',
        component:<Projection key={uuidv4()}/>,
        name:"Projection",
        navBar:false
    },
    {
        path:'/projection',
        component:<Projection key={uuidv4()}/>,
        name:"Projection",
        navBar:false
    }
]
export default routes;