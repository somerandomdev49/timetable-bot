import Data from './FilesData';

interface User {
  name: string;
  class: number;
}

interface SessionData {
  route: string;
  user: User;
  data: Data | null;
}

export default SessionData;
