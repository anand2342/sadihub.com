package com.sadihub.config;

import com.sadihub.entity.EventEntity;
import com.sadihub.entity.FamilyEntity;
import com.sadihub.entity.UserEntity;
import com.sadihub.entity.WeddingEntity;
import com.sadihub.repository.EventRepository;
import com.sadihub.repository.FamilyRepository;
import com.sadihub.repository.UserRepository;
import com.sadihub.repository.WeddingRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@SuppressWarnings("null")
public class DataInitializer implements CommandLineRunner {

    private final FamilyRepository familyRepository;
    private final UserRepository userRepository;
    private final WeddingRepository weddingRepository;
    private final EventRepository eventRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(FamilyRepository familyRepository,
                           UserRepository userRepository,
                           WeddingRepository weddingRepository,
                           EventRepository eventRepository,
                           PasswordEncoder passwordEncoder) {
        this.familyRepository = familyRepository;
        this.userRepository = userRepository;
        this.weddingRepository = weddingRepository;
        this.eventRepository = eventRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Seed default family if not exists
        FamilyEntity family = familyRepository.findByFamilyCode("WEDDING123").orElseGet(() -> {
            FamilyEntity newFamily = new FamilyEntity("family-default", "Nayak Family", "nayak-family", "WEDDING123");
            return familyRepository.save(newFamily);
        });

        // Seed default users if empty
        if (userRepository.count() == 0) {
            String encodedPass = passwordEncoder.encode("password123");

            // 1. Family Admin (Anand Nayak)
            UserEntity admin = new UserEntity();
            admin.setId("user-admin-1");
            admin.setFamilyId(family.getId());
            admin.setFullName("Anand Nayak");
            admin.setEmail("anand@sadihub.com");
            admin.setPassword(encodedPass);
            admin.setRelation("Groom's Brother");
            admin.setMobileNumber("9876543210");
            admin.setStatus("approved");
            admin.setRole("family_admin");
            admin.setAvatarUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80");
            userRepository.save(admin);

            // 2. Family Member - Suman Kumari (Approved)
            UserEntity suman = new UserEntity();
            suman.setId("user-suman-2");
            suman.setFamilyId(family.getId());
            suman.setFullName("Suman Kumari");
            suman.setEmail("suman@sadihub.com");
            suman.setPassword(encodedPass);
            suman.setRelation("Bride's Sister");
            suman.setMobileNumber("9876543211");
            suman.setStatus("approved");
            suman.setRole("family_member");
            suman.setAvatarUrl("https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80");
            userRepository.save(suman);

            // 3. Family Member - Karan Nayak (Pending Approval)
            UserEntity karan = new UserEntity();
            karan.setId("user-karan-3");
            karan.setFamilyId(family.getId());
            karan.setFullName("Karan Nayak");
            karan.setEmail("karan@sadihub.com");
            karan.setPassword(encodedPass);
            karan.setRelation("Groom's Cousin");
            karan.setMobileNumber("9876543212");
            karan.setStatus("pending");
            karan.setRole("family_member");
            karan.setAvatarUrl("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80");
            userRepository.save(karan);

            System.out.println("✅ Java Backend DataInitializer: Seeded 3 default users (Anand, Suman, Karan)");
        }

        // Seed default wedding if empty
        if (weddingRepository.count() == 0) {
            WeddingEntity wedding = new WeddingEntity();
            wedding.setId("wedding-default");
            wedding.setFamilyId(family.getId());
            wedding.setGroomName("Anurag Nayak");
            wedding.setGroomFather("Rajesh Nayak");
            wedding.setGroomMother("Sunita Nayak");
            wedding.setGroomBio("A visionary software engineer who loves traditional family celebrations.");
            wedding.setGroomImage("https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80");
            wedding.setBrideName("Shalu Kumari");
            wedding.setBrideFather("Suresh Kumar");
            wedding.setBrideMother("Meena Kumari");
            wedding.setBrideBio("A creative designer with a passion for art and culture.");
            wedding.setBrideImage("https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80");
            wedding.setWeddingDate("2026-08-25T10:00:00.000Z");
            wedding.setVenueName("The Royal Grand Palace");
            wedding.setVenueAddress("Ring Road, City Palace Enclave");
            weddingRepository.save(wedding);
            System.out.println("✅ Java Backend DataInitializer: Seeded default wedding details");
        }

        // Seed default events if empty
        if (eventRepository.count() == 0) {
            EventEntity haldi = new EventEntity();
            haldi.setId("event-haldi");
            haldi.setFamilyId(family.getId());
            haldi.setEventType("haldi");
            haldi.setTitle("Shahi Haldi Ceremony");
            haldi.setDescription("Yellow theme celebration with auspicious turmeric application and festive songs.");
            haldi.setEventDate("2026-08-24T09:00:00.000Z");
            haldi.setStartTime("09:00 AM");
            haldi.setEndTime("01:00 PM");
            haldi.setVenueName("Royal Lawn Poolside");
            eventRepository.save(haldi);

            EventEntity mehendi = new EventEntity();
            mehendi.setId("event-mehendi");
            mehendi.setFamilyId(family.getId());
            mehendi.setEventType("mehendi");
            mehendi.setTitle("Mehendi Ki Raat");
            mehendi.setDescription("Traditional henna designs, live folk music, and grand dinner.");
            mehendi.setEventDate("2026-08-24T17:00:00.000Z");
            mehendi.setStartTime("05:00 PM");
            mehendi.setEndTime("10:00 PM");
            mehendi.setVenueName("Heritage Courtyard");
            eventRepository.save(mehendi);

            EventEntity wedding = new EventEntity();
            wedding.setId("event-wedding");
            wedding.setFamilyId(family.getId());
            wedding.setEventType("wedding");
            wedding.setTitle("Shahi Vivah Ceremony");
            wedding.setDescription("Vedic rituals, Phera ceremony, and grand wedding feast.");
            wedding.setEventDate("2026-08-25T10:00:00.000Z");
            wedding.setStartTime("10:00 AM");
            wedding.setEndTime("04:00 PM");
            wedding.setVenueName("The Royal Grand Palace");
            eventRepository.save(wedding);

            System.out.println("✅ Java Backend DataInitializer: Seeded 3 default wedding events");
        }
    }
}
