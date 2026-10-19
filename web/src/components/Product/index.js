import React from 'react';
import Wrapper from './styles';
import { formatPrice } from '../../utils/helpers';
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const labelColors = {
  Baru: 'var(--clr-green-dark)',
  Promo: 'var(--clr-primary-4)',
  Terlaris: 'var(--clr-primary-5)',
  Limited: 'var(--clr-grey-1)',
  'Pre-Order': 'var(--clr-primary-7)',
};

const Product = ({ image, name, price, id, labels = [] }) => {
  return (
    <Wrapper>
      <div className='container'>
        <img src={image} alt='main' />
        {labels.length > 0 && (
          <div className='badges'>
            {labels.map((label) => (
              <span
                key={label}
                className='badge'
                style={{ background: labelColors[label] || 'var(--clr-primary-5)' }}
              >
                {label}
              </span>
            ))}
          </div>
        )}
        <Link to={`/products/${id}`} className='link'>
          <FaSearch />
        </Link>
      </div>
      <footer>
        <h5>{name}</h5>
        <p>{formatPrice(price)}</p>
      </footer>
    </Wrapper>
  );
};

export default Product;
