import { CustomBoxProvider } from '../context/CustomBoxContext';
import CustomBoxBuilder from '../components/CustomBox/CustomBoxPage';

export default function CustomBoxPage() {
  return (
    <CustomBoxProvider>
      <CustomBoxBuilder />
    </CustomBoxProvider>
  );
}
