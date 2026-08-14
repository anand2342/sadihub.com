package com.sadihub.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "weddings")
public class WeddingEntity {

    @Id
    private String id;

    @Column(name = "family_id", nullable = false, unique = true)
    private String familyId;

    @Column(name = "groom_name", nullable = false)
    private String groomName;

    @Column(name = "groom_father")
    private String groomFather;

    @Column(name = "groom_mother")
    private String groomMother;

    @Column(name = "groom_bio", length = 1000)
    private String groomBio;

    @Column(name = "groom_image", length = 1000)
    private String groomImage;

    @Column(name = "bride_name", nullable = false)
    private String brideName;

    @Column(name = "bride_father")
    private String brideFather;

    @Column(name = "bride_mother")
    private String brideMother;

    @Column(name = "bride_bio", length = 1000)
    private String brideBio;

    @Column(name = "bride_image", length = 1000)
    private String brideImage;

    @Column(name = "wedding_date", nullable = false)
    private String weddingDate;

    @Column(name = "venue_name")
    private String venueName;

    @Column(name = "venue_address", length = 500)
    private String venueAddress;

    @Column(name = "google_maps_link", length = 1000)
    private String googleMapsLink;

    @Column(name = "love_story", length = 2000)
    private String loveStory;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public WeddingEntity() {
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFamilyId() { return familyId; }
    public void setFamilyId(String familyId) { this.familyId = familyId; }

    public String getGroomName() { return groomName; }
    public void setGroomName(String groomName) { this.groomName = groomName; }

    public String getGroomFather() { return groomFather; }
    public void setGroomFather(String groomFather) { this.groomFather = groomFather; }

    public String getGroomMother() { return groomMother; }
    public void setGroomMother(String groomMother) { this.groomMother = groomMother; }

    public String getGroomBio() { return groomBio; }
    public void setGroomBio(String groomBio) { this.groomBio = groomBio; }

    public String getGroomImage() { return groomImage; }
    public void setGroomImage(String groomImage) { this.groomImage = groomImage; }

    public String getBrideName() { return brideName; }
    public void setBrideName(String brideName) { this.brideName = brideName; }

    public String getBrideFather() { return brideFather; }
    public void setBrideFather(String brideFather) { this.brideFather = brideFather; }

    public String getBrideMother() { return brideMother; }
    public void setBrideMother(String brideMother) { this.brideMother = brideMother; }

    public String getBrideBio() { return brideBio; }
    public void setBrideBio(String brideBio) { this.brideBio = brideBio; }

    public String getBrideImage() { return brideImage; }
    public void setBrideImage(String brideImage) { this.brideImage = brideImage; }

    public String getWeddingDate() { return weddingDate; }
    public void setWeddingDate(String weddingDate) { this.weddingDate = weddingDate; }

    public String getVenueName() { return venueName; }
    public void setVenueName(String venueName) { this.venueName = venueName; }

    public String getVenueAddress() { return venueAddress; }
    public void setVenueAddress(String venueAddress) { this.venueAddress = venueAddress; }

    public String getGoogleMapsLink() { return googleMapsLink; }
    public void setGoogleMapsLink(String googleMapsLink) { this.googleMapsLink = googleMapsLink; }

    public String getLoveStory() { return loveStory; }
    public void setLoveStory(String loveStory) { this.loveStory = loveStory; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
