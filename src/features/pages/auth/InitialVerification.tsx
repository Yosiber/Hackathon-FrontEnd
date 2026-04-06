import { useLocation, useNavigate } from "react-router-dom";
import { useUsers } from "../../context/UserContext";

export default function InitialVerification() {

    const { verifyUserRegistration, serverError } = useUsers();

    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;
    const createdUserId = location.state?.createdUserId;

}