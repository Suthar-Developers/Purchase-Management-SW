import { Navigate, useLocation } from 'react-router-dom'; import { useCan } from '../../context/PermissionContext';
export default function PermissionRoute({permission,children}){const allowed=useCan(permission),location=useLocation();return allowed?children:<Navigate to="/unauthorized" replace state={{from:location}}/>;}
