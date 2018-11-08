package com.ayham.vcr.config;

import java.time.Duration;

import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;

import io.github.jhipster.config.jcache.BeanClassLoaderAwareJCacheRegionFactory;
import io.github.jhipster.config.JHipsterProperties;

import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.cloud.client.serviceregistry.Registration;
import org.springframework.context.annotation.*;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        BeanClassLoaderAwareJCacheRegionFactory.setBeanClassLoader(this.getClass().getClassLoader());
        JHipsterProperties.Cache.Ehcache ehcache =
            jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration = Eh107Configuration.fromEhcacheCacheConfiguration(
            CacheConfigurationBuilder.newCacheConfigurationBuilder(Object.class, Object.class,
                ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                .build());
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            cm.createCache(com.ayham.vcr.repository.UserRepository.USERS_BY_LOGIN_CACHE, jcacheConfiguration);
            cm.createCache(com.ayham.vcr.repository.UserRepository.USERS_BY_EMAIL_CACHE, jcacheConfiguration);
            cm.createCache(com.ayham.vcr.domain.User.class.getName(), jcacheConfiguration);
            cm.createCache(com.ayham.vcr.domain.Authority.class.getName(), jcacheConfiguration);
            cm.createCache(com.ayham.vcr.domain.User.class.getName() + ".authorities", jcacheConfiguration);
            cm.createCache(com.ayham.vcr.domain.Student.class.getName(), jcacheConfiguration);
            cm.createCache(com.ayham.vcr.domain.Student.class.getName() + ".groups", jcacheConfiguration);
            cm.createCache(com.ayham.vcr.domain.Student.class.getName() + ".submissions", jcacheConfiguration);
            cm.createCache(com.ayham.vcr.domain.StudyGroup.class.getName(), jcacheConfiguration);
            cm.createCache(com.ayham.vcr.domain.StudyGroup.class.getName() + ".courses", jcacheConfiguration);
            cm.createCache(com.ayham.vcr.domain.Course.class.getName(), jcacheConfiguration);
            cm.createCache(com.ayham.vcr.domain.Course.class.getName() + ".sections", jcacheConfiguration);
            cm.createCache(com.ayham.vcr.domain.Section.class.getName(), jcacheConfiguration);
            cm.createCache(com.ayham.vcr.domain.Section.class.getName() + ".sessions", jcacheConfiguration);
            cm.createCache(com.ayham.vcr.domain.Section.class.getName() + ".readingMaterials", jcacheConfiguration);
            cm.createCache(com.ayham.vcr.domain.Session.class.getName(), jcacheConfiguration);
            cm.createCache(com.ayham.vcr.domain.Submission.class.getName(), jcacheConfiguration);
            cm.createCache(com.ayham.vcr.domain.ReadingMaterial.class.getName(), jcacheConfiguration);
            cm.createCache(com.ayham.vcr.domain.Assignment.class.getName(), jcacheConfiguration);
            cm.createCache(com.ayham.vcr.domain.Assignment.class.getName() + ".submissions", jcacheConfiguration);
            // jhipster-needle-ehcache-add-entry
        };
    }
}
