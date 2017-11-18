(function() {
  'use strict';

  const getStyle = () => {
    const styleSheetNames = new Set(Array.from(document.styleSheets).map(({href}) => href && href.split('/').pop()));
    let style = '';
    if (styleSheetNames.has('nightmode_twitter_core.bundle.css'))
      style += 'filter: invert(100%);';
    return style;
  };

  const icons = {
    keybase: '%%keybase',
    hackernews: '%%hackernews',
    reddit: '%%reddit',
    github: '%%github',
    generic_web_site: '%%generic_web_site',
    dns: '%%generic_web_site',
    facebook: '%%facebook',
  };

  const users = new Map();
  const getUser = (username) => {
    if (!users.has(username)) {
      users.set(
        username,
        fetch(`https://keybase.io/_/api/1.0/user/lookup.json?twitter=${username}`, {
          method: 'GET',
          cors: true,
        })
          .then(resp => resp.json())
          .then(({them: [{proofs_summary: {all}, basics: {username}}]}) => [{
            nametag: username,
            service_url: `https://keybase.io/${username}`,
              proof_type: 'keybase',
          }, ...all])
      );
    }
    return users.get(username);
  };

  const getProfileInfo = () => {
    let user;
    const element = document.querySelector('.ProfileCard-screenname:not(.proven),.ProfileHeaderCard-screenname:not(.proven)');
    if (element) {
      user = element.querySelector('b').innerText;
      element.classList.add('proven');
      getUser(user)
        .then((proofs) => proofs.map(({proof_type, nametag, service_url}) => {
          if (proof_type === 'twitter') return;
          element.innerHTML +=`
          <br/>
          <a href="${service_url}" class="ProfileHeaderCard-screennameLink u-linkComplex js-nav">
          <b><span style="${getStyle()}">${icons[proof_type]}</span> ${nametag}</b>
          </a>
          `;
        }));
    }
    const mobileElement = document.querySelector('._2CFyTHU5:not(.proven)');
    if (mobileElement) {
      user = mobileElement.querySelector('.Z5IeoGpY').innerText.replace('@', '');
      mobileElement.classList.add('proven');
      getUser(user)
        .then((proofs) => proofs.map(({proof_type, nametag, service_url}) => {
          if (proof_type === 'twitter') return;
          mobileElement.innerHTML +=`<br><span class="rn-13yce4e rn-fnigne rn-ndvcnb rn-gxnn5r rn-deolkf rn-6gldlz rn-1471scf rn-1lw9tu2 rn-ogifhg rn-7cikom rn-1it3c9n rn-ad9z0x rn-1mnahxq rn-61z16t rn-p1pxzi rn-11wrixw rn-wk8lta rn-9aemit rn-1mdbw0j rn-gy4na3 rn-bauka4 rn-irrty rn-qvutc0"><a href="${service_url}" style="" class=""><span style="${getStyle()}">${icons[proof_type]}</span> ${nametag}</a></span>`;
        }));
    }
  };
  window.setInterval(getProfileInfo, 1000);
  const getTweetInfo = () => {
    Array.from(document.querySelectorAll('.account-group:not(.proven), ._3Qd1FkLM div:not(.proven)'))
      .map(element => {
        element.classList.add('proven');
        const user = element.querySelector('.username b') ? element.querySelector('.username b').innerText : element.innerText.replace('@', '');
        const target = element.querySelector('.UserBadges') || element;
        getUser(user)
          .then((proofs) => proofs.map(({proof_type, nametag, service_url}) => {
            if (proof_type === 'twitter') return;
            target.innerHTML +=`
            <a href="${service_url}" title="${nametag}"><span style="${getStyle()}">${icons[proof_type]}</span></a>
            `;
          }));
      });
  };
  window.setInterval(getTweetInfo, 1000);
})();
