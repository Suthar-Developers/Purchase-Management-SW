import { useCan } from '../../context/PermissionContext';
const Can=({permission,children,fallback=null})=>useCan(permission)?children:fallback; export default Can;
