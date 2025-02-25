import Image from '@assets/empty-box.png';

import './styles.scss'

export default function EmptyBoxImage({size}) {

    const imageSize = size ? Math.max(size, 100) : 100;
    return (
        <img
            src={Image}
            alt="empty-data"
            style={{
                height: imageSize,
                width: imageSize
            }}
            className='empty-box-image'
        />
    )
}