/* -------- Helper functions về user -------- */
import {
  get
} from 'lodash';
import { getFileURL } from './file';

/**
 * Lấy thông tin của user
 * @param {Object} auth Auth state (props.auth)
 * @returns {Object}
 */
export function getUserInfo(auth) {
  const name = get(auth, 'user.fullName', '');
  const imageURL = get(auth, 'user.userProfile.avatar.path');
  const defaultImage = `${process.env.PUBLIC_URL}/images/default-avatar.png`;
  const avatar = imageURL ? getFileURL({ imageURL }) : defaultImage;
  // Danh sách chức danh của QTUD
  const titles = get(auth, 'commonTitles', []);
  return {
    name,
    avatar,
    titles
  };
}

export default getUserInfo;
