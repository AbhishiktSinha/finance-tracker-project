import { cloneElement, useEffect, useMemo, useRef, useState } from 'react';
import { debounce, throttle } from '../../features/PrivateLayout/utils';
import { consoleError } from '../../console_styles';


export default function AutoHideHeader({ scrollParentRef, forceShow, children }) {
  const headerContentRef = useRef();

  const lastScrollTop = useRef(0);
  const [isHidden, setIsHidden] = useState(()=>(forceShow?true:false));

  const scrollYThreshold = 30;
  const scrollCooldown = 150;

  const scrollDownHandler = throttle(() => {
    setIsHidden(true);
  }, scrollCooldown, true);

  const scrollUpHandler = debounce(() => {
    setIsHidden(false);
  }, scrollCooldown);

  useEffect(() => {
    const scrollParent = scrollParentRef.current;

    scrollParent.addEventListener('scroll', (e) => {
      const currentScrollTop = scrollParent.scrollTop;

      const isScrollDown = currentScrollTop > lastScrollTop.current;

      const scrolledDistance = Math.abs(
        currentScrollTop - lastScrollTop.current
      );

      // #region DEBUG LOGS
      /* console.log(
        'currentScrollTop:',
        currentScrollTop,
        'lastScrollTop',
        lastScrollTop,
        'scrolledDistance',
        scrolledDistance
      );
      console.log('scroll direction:', isScrollDown ? 'DOWN' : 'UP');
      console.log(
        '-------------------------------------------------------------------------'
      ); */
      // #endregion

      if (isScrollDown) {

        if (!isHidden) {

          consoleError('hiding header');
          setIsHidden(true);
          // scrollDownHandler();
        }
      } 
      else if (!isScrollDown) {
        scrollUpHandler();
        // setIsHidden(false);
      }

      lastScrollTop.current = currentScrollTop;
    });
  }, []);

  useEffect(()=>{
    if (forceShow == true) {
      setIsHidden(false);
    }
  }, [forceShow])

  const enhancedChild =
    children && typeof children === 'object'
      ? isHidden
        ? cloneElement(children, {
            style: {
              position: 'sticky',
              top: '-100%',
              transition: '0.5s ease all',
            },
          })
        : cloneElement(children, {
            style: {
              position: 'sticky',
              top: '0px',
              transition: '0.3s ease all',
            },
          })
      : children;

  return <>{enhancedChild}</>;
}
